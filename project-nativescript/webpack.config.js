const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);
	webpack.chainWebpack((config) => {
		config.resolve.alias.set('utils/utils', '@nativescript/core/utils');
	});
	return webpack.resolveConfig();
};
