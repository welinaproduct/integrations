const { htm, withUiHook } = require("@welina/integration-utils");
const client = require("@sendgrid/client");

const actions = {
  submitApiKey: async ({ welinaClient, payload }) => {
    console.log("payload", payload);
    const { clientState } = payload;
    console.log("clientState", clientState);
    const metadata = await welinaClient.getMetadata();
    metadata.apiKey = clientState.apiKey;
    await welinaClient.setMetadata(metadata);
  },
  disconnect: async ({ welinaClient }) => {
    const metadata = await welinaClient.getMetadata();
    delete metadata.githubTokenInfo;
    await welinaClient.setMetadata(metadata);
  }
};

module.exports = withUiHook(async options => {
  const { payload, welinaClient } = options;
  const { action, clientState } = payload;

  if (action) {
    const resolver = actions[action];

    if (resolver) {
      await resolver({ welinaClient, payload });
    } else {
      throw new Error(`Sorry, resolver ${action} does not exist.`);
    }
  }

  return htm`
    <Page>
      <P>Your Sendgrid api key:</P>
      <Box>
        <Input name="apiKey" placeholder="api key" />
      </Box>
      <Button action="submitApiKey" invert>Submit</Button>
    </Page>
  `;
});
