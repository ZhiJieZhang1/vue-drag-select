
module.exports = {
  devServer: {
		port: '5566',
	},
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-drag-select/' : '/',
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'examples/index.html',
      filename: 'index.html'
    }
  }
}