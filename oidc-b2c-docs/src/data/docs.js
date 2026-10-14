export const navigation = [
  { group: 'OVERVIEW', items: [
    { id: 'introduction', title: 'Introduction' },
    { id: 'architecture', title: 'Architecture' },
    { id: 'prerequisites', title: 'Prerequisites' },
  ]},
  { group: 'USER FLOW', items: [
    { id: 'uf-register', title: 'Register the external app' },
    { id: 'uf-provider', title: 'Configure OIDC provider' },
    { id: 'uf-parameters', title: 'OIDC parameters' },
    { id: 'uf-claims', title: 'Claims mapping' },
    { id: 'uf-enable', title: 'Enable in a user flow' },
    { id: 'uf-test', title: 'Test the user flow' },
  ]},
  { group: 'CUSTOM FLOW', items: [
    { id: 'cf-environment', title: 'Prepare IEF environment' },
    { id: 'cf-register', title: 'Register the external app' },
    { id: 'cf-keys', title: 'Configure policy keys' },
    { id: 'cf-claims', title: 'Define claims' },
    { id: 'cf-profile', title: 'OIDC technical profile' },
    { id: 'cf-provider', title: 'Add claims provider' },
    { id: 'cf-journey', title: 'Integrate user journey' },
    { id: 'cf-rp', title: 'Relying-party policy' },
    { id: 'cf-upload', title: 'Upload custom policies' },
    { id: 'cf-test', title: 'Test the custom flow' },
  ]},
  { group: 'REFERENCE', items: [
    { id: 'troubleshooting', title: 'Troubleshooting' },
    { id: 'security', title: 'Security best practices' },
    { id: 'checklist', title: 'Setup checklist' },
    { id: 'references', title: 'Official references' },
  ]},
];

export const pages = {
  introduction: {
    title: 'OIDC Provider Configuration', eyebrow: 'OVERVIEW', subtitle: 'Configure external OpenID Connect federation in Azure AD B2C using built-in user flows or IEF custom policies.', updated: 'Internal engineering guide · v1.0',
    sections: [
      { id: 'purpose', title: '1. Purpose', body: 'This guide explains how to connect an external OpenID Connect (OIDC) identity provider to an existing Azure AD B2C tenant. It is designed to help an engineer complete the configuration, test the sign-in journey, and troubleshoot common integration failures.' },
      { id: 'paths', title: '2. Choose a configuration path', type: 'table', headers: ['Requirement', 'Use this path'], rows: [['Standard sign-up and sign-in experience configured in the portal', 'Built-in user flow'], ['Custom claims processing, orchestration, or policy-defined logic', 'IEF custom policy'], ['Existing solution already based on custom policies', 'Extend the existing policy set; do not replace it blindly']] },
      { id: 'scope', title: '3. Scope and important distinction', type: 'callout', tone: 'info', label: 'Read before starting', body: 'This guide targets an existing Azure AD B2C tenant and its B2C user-flow / IEF custom-policy experience. Microsoft Entra External ID for external tenants is a separate customer identity platform with different portal paths. Do not mix the two sets of instructions.' },
      { id: 'outcome', title: '4. Expected outcome', bullets: ['The external OIDC provider is registered and configured in B2C.', 'The provider is exposed in the intended sign-in journey.', 'The external response is validated and claims are mapped.', 'The application receives the expected B2C authentication result.', 'Positive and negative test cases have been checked.'] },
    ]
  },
  architecture: {
    title: 'Architecture and Authentication Flow', eyebrow: 'OVERVIEW', subtitle: 'Understand the responsibilities of the application, Azure AD B2C, and the external OIDC provider.',
    sections: [
      { id: 'flow', title: '1. End-to-end flow', type: 'steps', steps: [
        ['Application', 'The user starts the sign-in flow from the application.'],
        ['Azure AD B2C', 'B2C starts the selected user flow or custom policy and presents configured identity providers.'],
        ['External OIDC provider', 'The user authenticates with the external provider.'],
        ['Azure AD B2C', 'B2C processes and validates the response, then executes the remaining journey and maps claims.'],
        ['Application', 'The application receives the authentication result issued for its B2C registration.']
      ]},
      { id: 'tokens', title: '2. Understand the tokens', body: 'The external provider’s response and the tokens issued by Azure AD B2C have different audiences and purposes. The application should validate and consume the B2C response intended for that application; it should not treat an external IDP token as a substitute for the B2C token.' },
      { id: 'terms', title: '3. Key terms', type: 'table', headers: ['Term', 'Meaning'], rows: [['Issuer (`iss`)', 'Identifies the authority that issued a token.'], ['Subject (`sub`)', 'Identifies a user within the issuer’s namespace.'], ['Client ID', 'Identifies an application registration at the external provider.'], ['Metadata URL', 'OIDC discovery document describing endpoints and signing keys.'], ['Claims', 'Statements about the authenticated user or authentication event.'], ['Redirect URI', 'Registered endpoint to which the provider returns the authorization response.']] },
    ]
  },
  prerequisites: {
    title: 'Prerequisites', eyebrow: 'OVERVIEW', subtitle: 'Collect access, registration details, and provider metadata before making changes.',
    sections: [
      { id: 'azure-access', title: '1. Azure access', bullets: ['Access to the correct Azure AD B2C tenant.', 'Permission to manage identity providers and user flows.', 'For custom policies, permission to manage IEF policy keys and upload policies.', 'An application registration in B2C for the client application that will use the flow.'] },
      { id: 'provider-details', title: '2. Information from the external IDP', type: 'table', headers: ['Item', 'Why it is needed'], rows: [['Client ID', 'Identifies the application registered at the external IDP.'], ['Client secret (if required)', 'Authenticates a confidential client. Store it securely.'], ['OIDC metadata URL', 'Provides discovery metadata, including endpoints and signing-key information.'], ['Issuer URL', 'Identifies the token issuer.'], ['Scopes', 'Specifies the identity information requested.'], ['Supported response type / mode', 'Must be compatible with the provider and B2C configuration.'], ['Required claims', 'Defines the user information needed by the journey and application.']] },
      { id: 'record', title: '3. Record configuration values', type: 'code', language: 'text', code: 'B2C tenant:              {tenant-name}\nExternal provider name:  {provider-name}\nExternal client ID:      {external-client-id}\nOIDC metadata URL:       {metadata-url}\nB2C application:         {b2c-application-name}\nUser flow / policy ID:   {flow-or-policy-id}\nScopes:                  {required-scopes}\nRequired claims:         {claim-list}' },
      { id: 'secret-note', title: 'Credential handling', type: 'callout', tone: 'warning', label: 'Never put secrets in docs', body: 'Do not put real client secrets in screenshots, Markdown, XML committed to source control, or shared configuration tables. Store secrets in the appropriate Azure AD B2C policy key or approved secret store.' }
    ]
  },
  'uf-register': {
    title: 'Register the External Application', eyebrow: 'USER FLOW', subtitle: 'Create or configure an application registration at the external OIDC provider.',
    sections: [
      { id: 'open-idp', title: 'Step 1 — Open the external provider portal', body: 'Sign in to the developer or administration portal for the identity provider you plan to federate with. Confirm that you are working in the correct organization and environment.' },
      { id: 'create-app', title: 'Step 2 — Create or select an application', body: 'Create a dedicated application registration for the B2C federation, or select an existing registration that is approved for this use. Record the generated client ID.' },
      { id: 'callback', title: 'Step 3 — Register the B2C callback URI', body: 'For the standard tenant-based Azure AD B2C callback, the URI commonly follows this pattern. Replace the placeholder with the actual tenant name and confirm it matches the B2C configuration exactly.', type: 'code', language: 'text', code: 'https://{tenant-name}.b2clogin.com/{tenant-name}.onmicrosoft.com/oauth2/authresp' },
      { id: 'callback-note', title: 'Callback URI notes', type: 'callout', tone: 'warning', label: 'Exact match required', body: 'Do not use the client application’s local callback URL here. The external provider must redirect the OIDC response back to Azure AD B2C. If you use a custom domain or a policy-specific redirect configuration, follow the callback URI generated or documented for that configuration.' },
      { id: 'secret', title: 'Step 4 — Configure client authentication', body: 'Enable the OIDC authorization-code flow and confidential-client authentication as supported by the provider and B2C integration. Generate a client secret if the selected configuration requires one. Store it securely and record only where it is stored.' },
      { id: 'metadata', title: 'Step 5 — Obtain the OIDC metadata URL', body: 'Use the discovery URL supplied by the provider. It often resembles the following pattern, but provider-specific paths differ.', type: 'code', language: 'text', code: 'https://{issuer-host}/.well-known/openid-configuration' },
      { id: 'verify-metadata', title: 'Step 6 — Verify discovery metadata', bullets: ['Open the discovery URL in a browser or approved API tool.', 'Confirm that it returns JSON rather than an HTML login page.', 'Check the issuer, authorization endpoint, token endpoint, and signing-key endpoint.', 'Confirm the metadata is from the intended environment and uses HTTPS.'] }
    ]
  },
  'uf-provider': {
    title: 'Configure the OIDC Provider in Azure AD B2C', eyebrow: 'USER FLOW', subtitle: 'Create the provider configuration in the Azure portal.',
    sections: [
      { id: 'portal', title: 'Step 1 — Open Azure portal', body: 'Go to the Azure portal and sign in with an account that has permission to manage the target B2C tenant.', type: 'link', url: 'https://portal.azure.com/', linkLabel: 'Open Microsoft Azure Portal' },
      { id: 'tenant', title: 'Step 2 — Select and verify the tenant', steps: [['Open the directory selector', 'Choose the directory selector in the Azure portal.'], ['Switch to the B2C tenant', 'Select the Azure AD B2C tenant used by the application.'], ['Verify the context', 'Confirm the tenant name before making configuration changes.']] },
      { id: 'identity-providers', title: 'Step 3 — Open Identity providers', body: 'Navigate to Azure AD B2C → Identity providers. Portal labels may vary slightly by tenant experience.' },
      { id: 'portal-reference-image', title: 'Portal reference', type: 'image', src: '/images/azure-identity-providers.png', alt: 'Azure AD B2C Identity providers page showing the New OpenID Connect provider action and configured providers', caption: 'Reference screenshot: Azure AD B2C → Identity providers. Your tenant may show different providers or labels.' },
      { id: 'new-provider', title: 'Step 4 — Create the provider', steps: [['Select the OIDC provider option', 'Choose “New OpenID Connect provider” or the equivalent option shown in the portal.'], ['Enter a provider name', 'Use a clear name such as ContosoOIDC. This is an internal display name.'], ['Enter metadata URL', 'Use the verified discovery URL from the external provider.'], ['Enter client credentials', 'Provide the external client ID and secret if required by the chosen configuration.'], ['Review remaining fields', 'Configure scope, response type, response mode, and any other fields shown.'], ['Save', 'Save the provider, reopen it, and verify that the values persisted.']] },
      { id: 'portal-note', title: 'Configuration note', type: 'callout', tone: 'info', label: 'Use the fields shown in your tenant', body: 'The portal’s available fields and labels can vary. Do not invent values for fields that are not shown. Use settings supported by both the external provider and Azure AD B2C.' }
    ]
  },
  'uf-parameters': {
    title: 'Configure OIDC Parameters', eyebrow: 'USER FLOW', subtitle: 'Choose protocol settings that are compatible with the external provider.',
    sections: [
      { id: 'fields', title: '1. Field-by-field guidance', type: 'table', headers: ['Field', 'Guidance'], rows: [['Name', 'Use a clear and unique provider name.'], ['Metadata URL', 'Use the external provider’s valid OIDC discovery URL.'], ['Client ID', 'Enter the client ID issued by the external provider.'], ['Client secret', 'Provide the secret if required by the chosen client-authentication method.'], ['Scope', 'Include `openid`; request additional scopes only when needed and supported.'], ['Response type', 'Choose a supported response type, commonly `code` for authorization-code flow.'], ['Response mode', 'Use a response mode supported by both systems, for example `form_post` where applicable.'], ['Domain hint', 'Configure only if the provider and sign-in experience support it.']] },
      { id: 'scope', title: '2. Scope example', type: 'code', language: 'text', code: 'openid profile email' },
      { id: 'parameter-warning', title: '3. Do not copy settings blindly', type: 'callout', tone: 'warning', label: 'Provider compatibility matters', body: 'The response type, response mode, token endpoint authentication method, and scope must match the provider’s capabilities and B2C’s supported configuration. Confirm them against the provider metadata and official B2C guidance.' }
    ]
  },
  'uf-claims': {
    title: 'Map User Claims', eyebrow: 'USER FLOW', subtitle: 'Align claims returned by the external IDP with claims used by Azure AD B2C.',
    sections: [
      { id: 'mapping', title: '1. Typical claim mapping', type: 'table', headers: ['B2C claim', 'Common external claim', 'Purpose'], rows: [['`issuerUserId`', '`sub`', 'Stable external user identifier.'], ['`displayName`', '`name`', 'Display name.'], ['`givenName`', '`given_name`', 'First name.'], ['`surName`', '`family_name`', 'Last name.'], ['`email`', '`email`', 'Email address, if provided and verified as needed.'], ['`identityProvider`', 'Configured provider identifier', 'Records which identity provider was used.']] },
      { id: 'map-steps', title: '2. Mapping procedure', steps: [['Inspect provider claims', 'Use the provider’s documentation and a safe test response to identify actual claim names.'], ['Compare required claims', 'List the claims needed by the B2C journey and application.'], ['Configure mappings', 'Use the supported claim-mapping fields exposed by the portal or policy.'], ['Test missing claims', 'Confirm the journey handles optional or missing claims as intended.']] },
      { id: 'sub-note', title: 'Identifier guidance', type: 'callout', tone: 'warning', label: 'Do not assume email is a stable ID', body: 'Treat `sub` as an identifier within the issuer’s namespace. Do not use email as a permanent unique key unless the identity system and account-linking design explicitly guarantee the required behavior.' }
    ]
  },
  'uf-enable': {
    title: 'Enable the Provider in a User Flow', eyebrow: 'USER FLOW', subtitle: 'Make the configured OIDC provider available on the intended sign-in page.',
    sections: [
      { id: 'open-flow', title: 'Step 1 — Open User flows', body: 'In Azure AD B2C, select User flows and open the existing sign-up and sign-in flow used by the application. If none exists, create an appropriate flow first.' },
      { id: 'select-provider', title: 'Step 2 — Select the identity provider', steps: [['Open the identity-provider configuration', 'Find the section that controls identity providers for this user flow.'], ['Select the external OIDC provider', 'Choose the provider created in the previous chapter.'], ['Save changes', 'Save the user flow configuration.'], ['Verify persistence', 'Reopen the configuration and confirm the provider remains selected.']] },
      { id: 'enable-note', title: 'Important', type: 'callout', tone: 'info', label: 'Provider setup and flow enablement are separate', body: 'Creating an identity provider does not automatically enable it in every user flow. Repeat the enablement step for each flow that should offer this provider.' }
    ]
  },
  'uf-test': {
    title: 'Test and Validate the User Flow', eyebrow: 'USER FLOW', subtitle: 'Verify the entire B2C journey, not only the external login.',
    sections: [
      { id: 'run', title: 'Step 1 — Run the flow', steps: [['Open the selected user flow', 'Choose the flow configured in the previous chapter.'], ['Select Run user flow', 'Choose the registered test application and its configured reply URL.'], ['Start sign-in', 'Open the flow in a new browser session.'], ['Choose the external provider', 'Select the configured OIDC provider and authenticate with a test account.']] },
      { id: 'validate', title: 'Step 2 — Validate the result', bullets: ['The external provider authenticates the test user.', 'The browser returns to Azure AD B2C.', 'The user flow completes without an error.', 'The resulting token has the expected issuer and audience.', 'Required claims are present and mapped correctly.', 'The application can complete its expected sign-in behavior.'] },
      { id: 'test-cases', title: 'Step 3 — Test negative scenarios', type: 'table', headers: ['Scenario', 'Expected check'], rows: [['Incorrect credentials', 'Authentication fails safely at the external provider.'], ['Missing optional claim', 'The flow behaves according to the claim requirements.'], ['Missing required claim', 'The flow handles the condition predictably and securely.'], ['Cancelled sign-in', 'The application receives or displays the intended cancellation behavior.']] },
      { id: 'success-note', title: 'Acceptance criteria', type: 'callout', tone: 'success', label: 'End-to-end success', body: 'A successful login at the external provider is not enough. The full B2C flow and application response must complete successfully.' }
    ]
  },
  'cf-environment': {
    title: 'Prepare the IEF Custom Policy Environment', eyebrow: 'CUSTOM FLOW', subtitle: 'Understand the existing policy set before editing XML.',
    sections: [
      { id: 'open-ief', title: 'Step 1 — Open Identity Experience Framework', steps: [['Sign in to Azure', 'Use an account with access to the correct B2C tenant.'], ['Open Azure AD B2C', 'Confirm the tenant context.'], ['Open Identity Experience Framework', 'Find the custom policy management area.']] },
      { id: 'policy-files', title: 'Step 2 — Identify the policy files', type: 'table', headers: ['Common file', 'Responsibility'], rows: [['`TrustFrameworkBase.xml`', 'Foundational policy definitions.'], ['`TrustFrameworkLocalization.xml`', 'Localization settings, when used by the policy set.'], ['`TrustFrameworkExtensions.xml`', 'Custom claims, technical profiles, and extensions.'], ['`SignUpOrSignin.xml`', 'Relying-party policy that selects the user journey and output claims.']] },
      { id: 'backup', title: 'Step 3 — Back up existing policies', bullets: ['Download or copy the current policy files.', 'Record policy IDs and inheritance relationships.', 'Identify the sign-up/sign-in journey already in use.', 'Do not replace a working policy set with an unrelated starter pack.'] },
      { id: 'setup-link', title: 'If IEF has not been initialized', type: 'link', url: 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-get-started', linkLabel: 'Follow Microsoft’s custom policy setup guide' }
    ]
  },
  'cf-register': {
    title: 'Register the External Application', eyebrow: 'CUSTOM FLOW', subtitle: 'Register the callback expected by the B2C custom policy.',
    sections: [
      { id: 'register-steps', title: '1. Registration steps', steps: [['Open the external IDP portal', 'Create or select the application used for federation.'], ['Record the client ID', 'Use the ID generated by the external provider.'], ['Configure the redirect URI', 'Register the B2C callback used by your custom policy.'], ['Configure client authentication', 'Generate a secret only if the selected method requires one.'], ['Verify OIDC metadata', 'Confirm issuer, endpoints, and supported claims.']] },
      { id: 'redirect', title: '2. Standard B2C callback pattern', type: 'code', language: 'text', code: 'https://{tenant-name}.b2clogin.com/{tenant-name}.onmicrosoft.com/oauth2/authresp' },
      { id: 'redirect-warning', title: '3. Verify policy redirect behavior', type: 'callout', tone: 'warning', label: 'Match the actual policy configuration', body: 'The example assumes a standard tenant-based callback and a policy configuration that does not include the policy name in the redirect URI. If UsePolicyInRedirectUri or a custom domain changes the callback, register the URI actually used by the policy.' }
    ]
  },
  'cf-keys': {
    title: 'Configure the External Client Secret', eyebrow: 'CUSTOM FLOW', subtitle: 'Store the external provider secret in a B2C policy key and reference it from XML.',
    sections: [
      { id: 'policy-key', title: 'Step 1 — Open Policy Keys', body: 'Navigate to Azure AD B2C → Identity Experience Framework → Policy Keys.' },
      { id: 'create-key', title: 'Step 2 — Create a secret key', steps: [['Select Add', 'Choose the option for creating a manual secret, if available.'], ['Enter a name', 'For example, ExternalOIDCSecret. The portal may add the `B2C_1A_` prefix.'], ['Enter the secret', 'Paste the client secret issued by the external IDP into the secure field.'], ['Select supported key usage', 'Follow the documented usage for the selected OIDC client authentication method; shared client secrets are commonly referenced with the Signature usage.'], ['Create and verify', 'Confirm the final stored key name.']] },
      { id: 'key-snippet', title: 'Step 3 — Reference the key in XML', type: 'code', language: 'xml', code: '<CryptographicKeys>\n  <Key\n    Id="client_secret"\n    StorageReferenceId="B2C_1A_ExternalOIDCSecret" />\n</CryptographicKeys>' },
      { id: 'key-warning', title: 'Security note', type: 'callout', tone: 'warning', label: 'Never embed the secret in XML', body: 'The StorageReferenceId must match the key name in the tenant. The XML contains a reference, not the secret value. Verify the key usage required by the provider and technical-profile configuration.' },
      { id: 'key-doc', title: 'Official reference', type: 'link', url: 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/policy-keys-overview', linkLabel: 'Microsoft Learn — Policy keys overview' }
    ]
  },
  'cf-claims': {
    title: 'Define Required Claims', eyebrow: 'CUSTOM FLOW', subtitle: 'Declare claims that are not already available through policy inheritance.',
    sections: [
      { id: 'claims-schema', title: 'Step 1 — Open ClaimsSchema', body: 'Open `TrustFrameworkExtensions.xml` in an XML-aware editor and locate the `ClaimsSchema` section within `BuildingBlocks`.' },
      { id: 'claim-check', title: 'Step 2 — Check inherited definitions', bullets: ['Review the base policy and extensions policy for existing claim IDs.', 'Do not create duplicate claim IDs.', 'Confirm each claim’s data type and expected use.', 'Add only the missing claims required by the external provider and journey.'] },
      { id: 'common-claims', title: 'Common claims to review', type: 'table', headers: ['Claim ID', 'Use'], rows: [['`issuerUserId`', 'External user identifier, often mapped from `sub`.'], ['`identityProvider`', 'Provider identifier used by the policy.'], ['`authenticationSource`', 'Indicates the authentication source in common starter-pack patterns.'], ['`displayName`', 'User’s display name.'], ['`givenName`', 'First name.'], ['`surName`', 'Last name.'], ['`email`', 'Email address, if required by the journey.']] },
      { id: 'claim-note', title: 'Remember', type: 'callout', tone: 'info', label: 'Declaration is not retrieval', body: 'Declaring a claim makes it available to the policy schema; it does not automatically retrieve it from the external provider. The technical profile must map the provider’s actual claim into the declared B2C claim.' }
    ]
  },
  'cf-profile': {
    title: 'Create the OIDC Technical Profile', eyebrow: 'CUSTOM FLOW', subtitle: 'Define how the policy communicates with the external identity provider.',
    sections: [
      { id: 'profile-location', title: 'Step 1 — Locate ClaimsProviders', body: 'In `TrustFrameworkExtensions.xml`, locate the `ClaimsProviders` section. Add the external provider under the appropriate policy element, following the XML structure and inheritance already used by the project.' },
      { id: 'xml-example', title: 'Step 2 — Adapt this illustrative XML', type: 'code', language: 'xml', code: '<ClaimsProvider>\n  <DisplayName>External OIDC Provider</DisplayName>\n  <TechnicalProfiles>\n    <TechnicalProfile Id="ExternalOIDC">\n      <DisplayName>Sign in with External OIDC</DisplayName>\n      <Protocol Name="OpenIdConnect" />\n      <Metadata>\n        <Item Key="ProviderName">https://issuer.example.com</Item>\n        <Item Key="METADATA">https://issuer.example.com/.well-known/openid-configuration</Item>\n        <Item Key="client_id">YOUR_EXTERNAL_CLIENT_ID</Item>\n        <Item Key="response_types">code</Item>\n        <Item Key="response_mode">form_post</Item>\n        <Item Key="scope">openid profile email</Item>\n        <Item Key="UsePolicyInRedirectUri">false</Item>\n      </Metadata>\n      <CryptographicKeys>\n        <Key Id="client_secret" StorageReferenceId="B2C_1A_ExternalOIDCSecret" />\n      </CryptographicKeys>\n      <OutputClaims>\n        <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />\n        <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />\n        <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />\n        <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />\n        <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />\n        <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="ExternalOIDC" AlwaysUseDefaultValue="true" />\n        <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />\n      </OutputClaims>\n    </TechnicalProfile>\n  </TechnicalProfiles>\n</ClaimsProvider>' },
      { id: 'profile-fields', title: 'Step 3 — Understand the important elements', type: 'table', headers: ['Element', 'Purpose'], rows: [['`Protocol`', 'Declares the OIDC protocol.'], ['`METADATA`', 'Points to the provider discovery document.'], ['`client_id`', 'Identifies the registered external application.'], ['`response_types` / `response_mode`', 'Select the supported authorization response behavior.'], ['`scope`', 'Requests identity information.'], ['`CryptographicKeys`', 'References the secret when required.'], ['`OutputClaims`', 'Maps external claims into B2C claims.']] },
      { id: 'profile-warning', title: 'Before uploading', type: 'callout', tone: 'warning', label: 'Illustrative template only', body: 'Replace all placeholders. Verify the issuer and metadata URL, secret key name, claim schema, response type, response mode, client authentication, and policy inheritance against the actual provider and Microsoft technical-profile reference. Do not upload the template unchanged.' },
      { id: 'profile-reference', title: 'Official technical profile reference', type: 'link', url: 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/openid-connect-technical-profile', linkLabel: 'Microsoft Learn — OpenID Connect technical profile' }
    ]
  },
  'cf-provider': {
    title: 'Add the Claims Provider', eyebrow: 'CUSTOM FLOW', subtitle: 'Place the OIDC technical profile in the correct policy structure.',
    sections: [
      { id: 'provider-steps', title: 'Implementation steps', steps: [['Open the extensions policy', 'Edit `TrustFrameworkExtensions.xml`.'], ['Locate ClaimsProviders', 'Find the existing `ClaimsProviders` element.'], ['Add or update the provider', 'Add the OIDC technical profile within a `ClaimsProvider`.'], ['Verify IDs', 'Ensure the technical profile ID matches every reference to it.'], ['Check XML structure', 'Confirm elements are nested under the correct policy parent and do not duplicate existing IDs.']] },
      { id: 'provider-note', title: 'Important', type: 'callout', tone: 'info', label: 'Inheritance matters', body: 'The extensions policy builds on the base policy. Review inherited definitions before adding new ones, and make changes in the policy file intended to own the customization.' }
    ]
  },
  'cf-journey': {
    title: 'Integrate the Provider into the User Journey', eyebrow: 'CUSTOM FLOW', subtitle: 'Expose the provider and invoke its technical profile from the intended orchestration step.',
    sections: [
      { id: 'find-journey', title: 'Step 1 — Locate the sign-in journey', body: 'Find the sign-up/sign-in user journey defined or inherited by your policy set. Identify the orchestration step that presents available identity providers. Its number and structure depend on the existing journey.' },
      { id: 'fragment', title: 'Step 2 — Understand the required references', type: 'code', language: 'xml', code: '<ClaimsProviderSelections>\n  <ClaimsProviderSelection\n    TargetClaimsExchangeId="ExternalOIDCExchange" />\n</ClaimsProviderSelections>\n\n<ClaimsExchanges>\n  <ClaimsExchange\n    Id="ExternalOIDCExchange"\n    TechnicalProfileReferenceId="ExternalOIDC" />\n</ClaimsExchanges>' },
      { id: 'integrate', title: 'Step 3 — Integrate into the existing orchestration step', bullets: ['Place the provider selection and claims exchange in the appropriate existing orchestration step.', 'Ensure the exchange ID matches the target claims exchange ID.', 'Ensure the technical profile reference matches the profile ID exactly.', 'Preserve existing local-account providers and downstream account lookup or creation steps.', 'Validate that the step still conforms to the policy schema and intended journey.'] },
      { id: 'journey-warning', title: 'Do not replace the entire journey', type: 'callout', tone: 'warning', label: 'Fragment only', body: 'The XML above illustrates the relationship between the IDs; it is not a complete orchestration step or complete user journey. Merge it into the actual policy structure and verify the surrounding elements.' }
    ]
  },
  'cf-rp': {
    title: 'Configure the Relying-Party Policy', eyebrow: 'CUSTOM FLOW', subtitle: 'Ensure the application invokes the journey that contains the new OIDC provider.',
    sections: [
      { id: 'rp-open', title: 'Step 1 — Open the relying-party policy', body: 'Open the policy used by the application, commonly named `SignUpOrSignin.xml` in starter-pack examples.' },
      { id: 'rp-check', title: 'Step 2 — Verify the configuration', bullets: ['Confirm the policy ID and base-policy reference.', 'Confirm the default user journey points to the intended sign-up/sign-in journey.', 'Review the relying-party technical profile and output claims.', 'Expose only the claims required by the application.', 'Check that all referenced journeys and technical profiles exist.'] },
      { id: 'rp-warning', title: 'Keep the application configuration aligned', type: 'callout', tone: 'info', label: 'Policy ID matters', body: 'The application must request the correct B2C policy. A correctly configured provider will not be used if the application invokes a different relying-party policy or user journey.' }
    ]
  },
  'cf-upload': {
    title: 'Upload Custom Policies', eyebrow: 'CUSTOM FLOW', subtitle: 'Validate and upload the policy files in dependency order.',
    sections: [
      { id: 'validate-xml', title: 'Step 1 — Validate the XML', bullets: ['Check XML well-formedness in an XML-aware editor.', 'Check policy IDs and base-policy references.', 'Check duplicate IDs and unresolved technical-profile references.', 'Check claims and transformations used by the technical profile.', 'Review changes against the existing policy set.'] },
      { id: 'upload', title: 'Step 2 — Upload in dependency order', steps: [['Base policy', 'Upload only if it needs to be updated and is part of the deployment.'], ['Supporting policies', 'Upload localization or other dependencies as applicable.'], ['Extensions policy', 'Upload the updated claims schema, provider, and technical profile.'], ['Relying-party policy', 'Upload after the referenced dependencies are available.']] },
      { id: 'upload-note', title: 'Existing tenant note', type: 'callout', tone: 'warning', label: 'Do not overwrite blindly', body: 'For an existing environment, upload only the necessary files while preserving dependencies and approved customizations. Follow your team’s change-management process and retain a rollback copy.' },
      { id: 'upload-errors', title: 'Step 3 — Resolve upload errors', body: 'Read the complete portal error. Check XML structure, policy inheritance, claim IDs, technical-profile IDs, key references and user-journey references before retrying.' }
    ]
  },
  'cf-test': {
    title: 'Test the Custom Flow', eyebrow: 'CUSTOM FLOW', subtitle: 'Run the relying-party policy and validate the complete journey.',
    sections: [
      { id: 'run-policy', title: 'Step 1 — Run the relying-party policy', steps: [['Open the relying-party policy', 'Select the intended sign-up/sign-in policy in Identity Experience Framework.'], ['Choose Run now', 'Select the registered test application and configured reply URL.'], ['Start sign-in', 'Choose the external OIDC provider and authenticate with a test account.'], ['Complete the journey', 'Complete any account creation or linking steps required by the policy.']] },
      { id: 'verify', title: 'Step 2 — Verify the response', bullets: ['The external provider authenticates the user.', 'The response returns to B2C using the expected callback.', 'The custom policy completes without an upload or runtime error.', 'The expected claims are present and mapped.', 'The application receives the expected B2C authentication response.'] },
      { id: 'negative', title: 'Step 3 — Test negative scenarios', type: 'table', headers: ['Scenario', 'What to verify'], rows: [['Invalid credentials', 'The provider denies authentication safely.'], ['Missing required claim', 'The policy fails or handles the claim according to its design.'], ['User cancels authentication', 'The application handles cancellation predictably.'], ['Expired or incorrect secret', 'The configuration failure is diagnosed without exposing the secret.']] },
      { id: 'logs', title: 'Step 4 — Diagnose failures', body: 'Use the available B2C sign-in diagnostics, policy execution details, and external provider logs. Correlate timestamps and request identifiers where available. Do not log raw tokens or credentials.' }
    ]
  },
  troubleshooting: {
    title: 'Troubleshooting', eyebrow: 'REFERENCE', subtitle: 'Use the observed symptom and full error details to narrow down the cause.',
    sections: [
      { id: 'errors', title: 'Common errors', type: 'table', headers: ['Symptom', 'Possible cause', 'What to check'], rows: [
        ['`invalid_client`', 'Incorrect client ID or client authentication.', 'Verify client ID, secret, and supported authentication method.'],
        ['Redirect URI mismatch', 'Registered callback differs from actual callback.', 'Compare exact scheme, host, path, tenant, and policy behavior.'],
        ['Metadata error', 'Invalid or inaccessible discovery endpoint.', 'Open the metadata URL and verify its JSON, issuer and endpoints.'],
        ['Provider not visible', 'Provider not enabled in the user flow or not connected to the custom journey.', 'Check user-flow provider selection or orchestration references.'],
        ['Missing claims', 'Scope or claim mapping is incorrect.', 'Inspect actual provider claims and output mappings.'],
        ['Issuer validation failure', 'Issuer configuration differs from the token issuer.', 'Compare configured issuer with provider metadata and response.'],
        ['Custom policy upload fails', 'Malformed XML, duplicate ID, or unresolved reference.', 'Validate schema, inheritance, claims, keys and technical-profile IDs.'],
        ['External login works but B2C fails', 'B2C validation or subsequent policy step fails.', 'Check callback, token validation, required claims and account-processing steps.']
      ] },
      { id: 'debug-order', title: 'Recommended diagnostic order', steps: [['Capture the exact error', 'Record the error code and safe diagnostic details; remove secrets and tokens.'], ['Verify tenant and policy', 'Confirm the expected tenant, user flow or relying-party policy is being run.'], ['Verify metadata and callback', 'Check discovery metadata and exact redirect URI.'], ['Verify credentials', 'Confirm the client ID and secure secret reference.'], ['Verify claims and journey', 'Check claim mappings, policy IDs and orchestration references.'], ['Retest after one change', 'Change one item at a time and record the result.']] }
    ]
  },
  security: {
    title: 'Security Best Practices', eyebrow: 'REFERENCE', subtitle: 'Protect credentials, validate the federation configuration, and limit exposed user data.',
    sections: [
      { id: 'practices', title: 'Required practices', bullets: ['Store client secrets in policy keys or an approved secret store; never commit them to source control.', 'Use HTTPS endpoints and trusted OIDC metadata.', 'Validate issuer, audience, signing keys, and response behavior according to the protocol and B2C configuration.', 'Use stable external identifiers for account association; do not assume email is immutable.', 'Request only necessary scopes and claims.', 'Avoid exposing tokens, credentials, or sensitive personal data in logs and screenshots.', 'Back up policies and use change review before deploying to shared or production tenants.', 'Test success, failure, cancellation, and missing-claim scenarios.'] },
      { id: 'security-note', title: 'Security review', type: 'callout', tone: 'warning', label: 'Before production', body: 'Have the identity/security owner review the external provider’s token validation settings, account-linking rules, client-secret rotation process, and diagnostic logging before production rollout.' }
    ]
  },
  checklist: {
    title: 'Setup Checklist', eyebrow: 'REFERENCE', subtitle: 'Use this interactive checklist to verify the implementation before handover.',
    sections: [
      { id: 'checklist-intro', title: 'Implementation verification', body: 'Check the items relevant to the implementation path you used. Checklist state is kept only in the current page session and is not saved to a server.' },
      { id: 'checklist-items', title: 'Checklist', type: 'checklist', groups: [
        { title: 'Prerequisites', items: ['Correct Azure AD B2C tenant selected', 'External IDP application registered', 'Client ID, metadata URL, and required credentials available', 'Required permissions confirmed'] },
        { title: 'OIDC configuration', items: ['Redirect URI verified', 'Metadata endpoint accessible', 'OIDC parameters configured', 'Required claims mapped'] },
        { title: 'User Flow path', items: ['OIDC provider enabled in the selected user flow', 'Test sign-in completed', 'B2C token and required claims validated'] },
        { title: 'Custom Flow path', items: ['Policy key configured securely', 'Technical profile added and validated', 'Provider connected to the user journey', 'Relying-party policy reviewed', 'Policies uploaded and tested'] },
        { title: 'Final verification', items: ['Failure scenarios tested', 'No secrets exposed in source control or logs', 'Configuration and rollback notes recorded'] }
      ]}
    ]
  },
  references: {
    title: 'Official References', eyebrow: 'REFERENCE', subtitle: 'Use Microsoft Learn as the source of truth for portal behavior and custom policy schema.',
    sections: [
      { id: 'links', title: 'Microsoft Learn', type: 'links', links: [
        ['Generic OIDC identity provider for Azure AD B2C', 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/identity-provider-generic-openid-connect'],
        ['OpenID Connect technical profile', 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/openid-connect-technical-profile'],
        ['Get started with custom policies', 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-get-started'],
        ['Policy keys overview', 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/policy-keys-overview'],
        ['Claims providers in custom policies', 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/claimsproviders'],
        ['User flows overview', 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview']
      ] },
      { id: 'lifecycle', title: 'Platform lifecycle note', type: 'callout', tone: 'warning', label: 'Confirm tenant eligibility', body: 'Azure AD B2C stopped being available for purchase by new customers on May 1, 2025. Confirm that your organization has an eligible existing tenant and that the required features remain available before planning a new deployment. Do not confuse Azure AD B2C with Microsoft Entra External ID for external tenants.' }
    ]
  }
};
