const port = process.argv.length > 2 ? process.argv[2] : 4000;

App.use(express.static('public'));