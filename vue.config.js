
module.exports = {
  devServer: {
		port: '5566',
	},
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'examples/index.html',
      filename: 'index.html'
    }
  }
}