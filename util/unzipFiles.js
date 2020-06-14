    const extract = require('extract-zip')
 
    async function main (source, destination) {
      try {
        await extract(source, { dir: destination})
        console.log('Extraction complete')
      } catch (err) {
        // handle any errors
      }
    }
    main();