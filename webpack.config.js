const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/index.js', // Punto de entrada de la aplicacion
    output: { //Lugar donde se guardara lo que creara webpack
        path: path.resolve(__dirname, 'dist'),
        //cambios este elemento y le pondremos tanto el name para que lo identifique
        //como la parte del contenthash para que nos muestre eso
        filename: '[name].[contenthash].js',
        //para insertar el cambio y mover las fuentes a otra carpte lo hacemos aqui
        //assetModuleFilename: 'assets/image/[hash][ext][query]',
        clean: true, // Clean the output directory before emit.
    },
    resolve: { //Que tipo de extensiones que tiene que identificar webpack que estan en el proyecto, para asi poder leerlos.
        extensions: ['.js'],
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@templates': path.resolve(__dirname, 'src/templates'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@images': path.resolve(__dirname, 'src/assets/images'),
        }
    },
    module: { //Reglas
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css|.scss$/i,
                use: [MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.png/,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2)$/i,  // Tipos de fuentes a incluir
                type: 'asset/resource',  // Tipo de módulo a usar (este mismo puede ser usado para archivos de imágenes)
                generator: {
                    filename: 'static/fonts/[hash][ext][query]',  // Directorio de salida
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }),
        //Le anadimos una configuracion al plugin que nos permite compilar en css
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({ //Para mover un archivo o directorio al proyecto final
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
          ]
    },
}