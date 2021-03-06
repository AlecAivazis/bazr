var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var dotenv = require('dotenv')

// load environment variables
dotenv.config()

module.exports = {
    entry: './client/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'client')
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                SERVER_BLOCKCHAIN_ADDRESS: JSON.stringify(process.env.SERVER_BLOCKCHAIN_ADDRESS),
                GITHUB_WEBHOOK_HOST: JSON.stringify(process.env.GITHUB_WEBHOOK_HOST)
            }
        }),
        // *sigh*... remove the annoying .flow warnings
        // FROM: https://github.com/graphql/graphql-language-service/issues/128
        new webpack.ContextReplacementPlugin(
            /graphql-language-service-interface[\\/]dist$/,
            new RegExp(`^\\./.*\\.js$`)
        )
    ],
    devtool: 'source-map',
    devServer: {
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/graphql': 'http://localhost:4000/graphql'
        }
    }
}
