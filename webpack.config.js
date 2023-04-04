module.exports = {
    entry: './src/index.js',
    mode: 'production',
    node: {
        fs: 'empty'
    },
    output: {
        filename: 'dist/bundle.js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /node_modules\/@chainsafe\/.*\.js$/,
                loader: 'babel-loader',
                options: {
                    compact: true,
                    presets: ['@babel/preset-env']
                }
            }
        ]
    }
};
