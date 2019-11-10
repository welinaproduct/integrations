const { htm, withUiHook } = require("@welina/integration-utils");

module.exports = withUiHook(async ({ payload, welinaClient }) => {
  const { clientState = {} } = payload;

  const metadata = (await welinaClient.getMetadata()) || {};

  if (!metadata.office365TokenInfo) {
    return htm`
      <Page>
        <Link href="https://welina.io/integrations/office365">Configuration needed</Link>
      </Page>
    `;
  }

  return htm`
    <Page>
      <div>
        <Input type="radio" id="perso" name="emailUsed" value="perso" />
        <label for="perso">Invite sent to personal email</label>
      </div>
      <div>
        <Input type="radio" id="pro" name="emailUsed" value="pro" />
        <label for="pro">Invite sent to professional email</label>
      </div>
      <Button action="submit">Submit</Button>
    </Page>
  `;
});
