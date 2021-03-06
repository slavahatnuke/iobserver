module.exports = {
    entry: './index.js',
    output: {
        filename: 'iobserver.js',
        path: `${__dirname}/dist`,
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};