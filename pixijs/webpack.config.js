const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    mode: "development",
    entry: { bundle: "./src/js/index.js" },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].[contenthash].js",
        clean: true,
        assetModuleFilename: "[name][ext]",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            // backwards compatible
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        port: 3000,
        open: false,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: "PIXI Tutorial",
            filename: "index.html",
            template: "src/template.html",
        }),
        // new BundleAnalyzerPlugin(),
    ],
};
