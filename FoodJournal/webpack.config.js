/// <binding />
console.log("started");
const path = require("path");
const webpack = require("webpack");
//const HtmlWebpackPlugin = require("html-webpack-plugin");
const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixDefaultImportPlugin = require('webpack-fix-default-import-plugin');
//const nodeExternals = require('webpack-node-externals');

module.exports = function (env) {
    env = env || process.env || {};
    env.mode = env.NODE_ENV;
    var isProd = env.NODE_ENV === 'production';
    //console.log(env);
    const BUILD_DIRECTORY = 'Content/dist'; // this is the project folder the compiled files go to.
    const APP_DIRECTORY = 'Scripts/App';            // this is the Typescript source folder.  All your 'entry' sources are relative to this.
    const BUILD_DROP_PATH = path.resolve(__dirname, BUILD_DIRECTORY);
    const APP_PATH = path.resolve(__dirname, APP_DIRECTORY);
    var config = {
        entry: {
            // Example for compiling Typescript bundles for your page.
            // The source Typescript is compiled and saved to your application's
            // 'Content/dist' folder.  And an entry into the application's webpack.assets.json
            // file to allow the application to load the correct versions of the scripts.

            // NameOfOutputJsFileWoExtension: APP_PATH + "/NameOfSourcePageTsFileWoExtension",
            FoodJournal: APP_PATH + "/startup" 
        },
        output: {
            path: BUILD_DROP_PATH,
            //filename: "[name].[chunkhash].js",
            filename: isProd ? "[name].[chunkhash].js" : "[name].js",
            publicPath: "/",
            libraryTarget: 'umd'
        },
        resolve: {
            modules: ['node_modules'],
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
                //"jquery-ui": "jquery-ui/jquery-ui.js",
                //modules: path.join(__dirname, "node_modules")
                //typeahead: 'typeahead.js',
                //bloodhound: 'typeahead.js/src/bloodhound',
                kendo: '@progess/kendo-ui/js/'
            }
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader"
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        //"autoprefixer-loader"
                    ]
                },
                {
                    test: /\.less$/,
                    //exclude: /node_modules/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "./"
                            }
                        },
                        "css-loader",
                        //"autoprefixer-loader",
                        "less-loader"
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    //exclude: /node_modules/,
                    use: [
                        {
                            //loader: "file-loader",
                            loader: "url-loader?name=img/[name].[ext]",
                            //loader: "url-loader?name=img/[name].[ext]&limit=10",
                            options: {
                                name: '[name].[ext]',
                                publicPath: "./"
                            }
                        },

                    ]
                },
                //{
                //    test: /\.(svg)$/,
                //    //exclude: /node_modules/,
                //    use: [
                //        {
                //            loader: "raw-loader",
                //            //loader: "url-loader?name=img/[name].[ext]&limit=10",
                //            //options: {
                //            //    name: '[name].[ext]',
                //            //    publicPath: "./"
                //            //}
                //        },

                //    ]
                //},
                {
                    test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
                    //exclude: /node_modules/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: '[name].[ext]',
                                publicPath: "./"
                            }
                        },

                    ]
                }
            ]
        },

        plugins: [
            new AssetsPlugin({
                filename: 'webpack.assets.json',
                path: BUILD_DROP_PATH,
                prettyPrint: true
            }),
            new CleanWebpackPlugin(["Content/dist/*"]),
            //new HtmlWebpackPlugin({
            //    template: "./src/index.html"
            //}),
            new MiniCssExtractPlugin({
                filename: isProd ? "[name].[chunkhash].css" : "[name].css",
                chunkFilename: isProd ? "[id].[chunkhash].css" : "[id].css"
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                jquery: 'jquery',
                'window.$': 'jquery',
                'window.jQuery': 'jquery',
                bootstrap: 'bootstrap',
                Popper: ['popper.js', 'default'],
                //handlebars: 'handlebars/dist/handlebars.min',
                //typeahead: path.resolve(__dirname, 'wwwroot/lib/typeahead/typeahead'),
                //jabberwerx: path.resolve(__dirname, 'Content/lib/cisco/jabberwerx')
            }),
            new FixDefaultImportPlugin()
        ],
        //target: 'node',
        externals: {
            // These are listed as external, because we don't want to compile them into the page scripts.
            // They are shared in the domain root.

            jquery: 'jQuery',
            bootstrap: 'bootstrap',
            //'@progress/kendo-ui': '@progress/kendo-ui',
            //kendo: 'kendo'
            //jabberwerx: 'jabberwerx'
        }
        //externals: [nodeExternals()], // in order to ignore all modules in node_modules folder 
    };


    return config;
};