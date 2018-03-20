const fs = require('fs');
const path = require('path');
const version = require('./version');

describe('config/version', () => {
  const versionFilePath = path.join(process.cwd(), '/.version');
  let config = null;

  before(() => {
    try {
      const versionFile = fs.lstatSync(versionFilePath);
      fs.renameSync(versionFilePath, `${versionFilePath}.bak`);
    } catch (ex) {}
    config = version();
  });

  after(() => {
    try {
      fs.lstatSync(`${versionFilePath}.bak`);
      fs.renameSync(`${versionFilePath}.bak`, versionFilePath);
    } catch (ex) {}
  });

  context('when version file is not present', () => {
    it('uses the version from the package.json', () => {
      expect(config).to.eql(
        require(path.join(process.cwd(), './package.json'))
          .version
      );
    });
  });

  context('when version file is present', () => {
    before(() => {
      fs.writeFileSync(versionFilePath, '_version_placeholder');
      config = version();
    });

    after(() => {
      fs.unlinkSync(versionFilePath);
    });

    it('retrieves the correct version from the version file', () => {
      expect(config).to.eql('_version_placeholder');
    });
  });
});
