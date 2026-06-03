const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

        new CopyWebpackPlugin([
            { from: { glob: "fonts/**" } },
            { from: { glob: "**/*.jpg" } },
            { from: { glob: "**/*.png" } },
            { from: { glob: "**/*.sqlite" }},
        ], { ignore: [`${relative(appPath, appResourcesFullPath)}/**`] })

		externals.push('nativescript-sqlite-commercial');
        externals.push('nativescript-sqlite-encrypted');
        externals.push('nativescript-sqlite-sync');

	return webpack.resolveConfig();
};
