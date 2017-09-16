// モジュール読み込み
var gulp = require("gulp");								// gulpを呼び出す
var sass = require("gulp-sass");						// gulpでのsass利用
var autoprefixer = require("gulp-autoprefixer");		// ベンダプレフィックス付与
var frontnote = require("gulp-frontnote");				// スタイルガイド生成
var uglify = require("gulp-uglify");					// JavaScriptの圧縮
var browser = require("browser-sync");					// LiveReload環境構築
var rimraf = require('rimraf');							// ファイル削除
var imagemin = require("gulp-imagemin");				// 画像最適化
var pngquant = require("imagemin-pngquant");			// png最適化
var mozjpeg  = require("imagemin-mozjpeg");				// jpg最適化
var jpegrec = require("imagemin-jpeg-recompress");		// jpg最適化 - macだと「imagemin-mozjpeg」がエラー起こすのでこっち使った方が良い
var connect = require("gulp-connect-php");				// phpを扱うようにする
var pleeease = require('gulp-pleeease');				// sassやベンダープレフィックス付与、min化ができる


/*// タスク
・server
・js
・sass
・move
・copy
・clean
・imagemin
・
・
・
・
・
・


*/






// サーバー実行
gulp.task("server", function() {
	// connect.server({
	// 	base:'./public',					// ベースとなるフォルダ
	// 	port: 8000,
	// 	bin: 'C:/xampp/php/php.exe',							// [win]xamppのphp.exe （xamppのApacheの起動は不要。必要があればパスを通す。）
	// 	ini: 'C:/xampp/php/php.ini'								// [win]xamppのphp.ini
	// 	// bin: '/Applications/XAMPP/xamppfiles/bin/php',		// [mac]xamppのphp.exe （xamppのApacheの起動は不要。必要があればパスを通す。）
	// 	// ini: '/Applications/XAMPP/xamppfiles/etc/php.ini		// [mac]xamppのphp.ini
	// }, function (){
		browser({
			server: {
				baseDir: "./public/",		// ベースとなるフォルダ
				index: "index.html"			// 起動時に開かれるページ
			},
			// open: 'external',			// IPアドレスアクセス
			// tunnel: true,				// 外部アクセス制御
			// proxy: 'localhost:8000/',	// proxyを設定することによってこの指定ページを表示するようになる
			files: './public/**/*.*',		// 監視対象のファイル
			port: 3000						// port番号
		});
	// });
});

// jsファイル圧縮
gulp.task("js", function() {
	gulp.src(["./src/js/*.js","!./src/js/bubdle/**/*.js"])
		.pipe(uglify())
		.pipe(gulp.dest("./public/js/min"))
		// .pipe(browser.reload({stream:true}))
});

// sass
gulp.task("sass", function() {					// gulp.task(“タスク名”,function() {});でタスクの登録をおこないます。
	gulp.src("./src/sass/**/*scss")				// gulp.src(“MiniMatchパターン”)で読み出したいファイルを指定します。
		// .pipe(frontnote({
		// 	css: '../public/css/style.css'
		// }))
		// .pipe(sass())							// pipe(おこないたい処理)でsrcで取得したファイルに処理を施します
		// .pipe(autoprefixer())					// ベンダープレフィックス付与
		.pipe(sass({
			includePaths: require('node-reset-scss').includePath
		}))
		.pipe(pleeease({
			sass: false,
			autoprefixer:true,
			minifier: false,
			mqpacker: true
		}))
		.pipe(gulp.dest("./public/css"))		// gulp.dest(“出力先”)で出力先に処理を施したファイルを出力します。
		// .pipe(browser.reload({stream:true}))
});





// 移動（copy ＞ clean） ★これを実行する
gulp.task('move', ['clean'], function() {});

//コピー
gulp.task( 'copy', function() {
	return gulp.src(
		[ './src/*.html', './src/css/**', './src/js/*.js', './src/images/*.*' ],
		{ base: 'src' }
	)
	.pipe( gulp.dest( 'public' ) );
} );

// copyに依存するタスク
gulp.task('clean', ['copy'], function (cb) {
	// clean（ファイルコピー完了後に実行される）
	rimraf('./src/**/*.*', cb);
});




// 画像最適化
gulp.task('imagemin', function(){
	gulp.src("./src/images/*.jpg")
		.pipe(imagemin(
			// [imagemin.jpegtran({quality:85, progressive: true})] // mozjpegはmacでエラーが発生するためjpegtranを利用する（少し圧縮率が低い）
			// [jpegrec({quality:'low', min:40, max:85})] // quality: low, midium, high, veryhigh
			[mozjpeg({quality:85, progressive: true})]
		))
		.pipe(gulp.dest("./public/images"));
	gulp.src("./src/images/*.png")
		.pipe(imagemin(
			[pngquant({quality: '40-80', speed: 1})] //40-70
		))
		.pipe(imagemin()) // pngquantで圧縮した画像が暗くなる現象対策（余計なガンマ情報を削除）
		.pipe(gulp.dest("./public/images"));
});





// 「gulp」で実行のタスク （ファイルの監視/js/sass、サーバー実行）
gulp.task("default",['imagemin', 'js','sass','server'], function() {
	//ファイルの監視をして変化があったらタスクを実行
	gulp.watch(["./src/js/*.js","!./src/js/bubdle/**/*.js"],["js"]);
	// gulp.watch(["./src/images/**/*.*"],["imagemin"]);
	// gulp.watch(["./src/js/**/*.js"],["js"]);
	gulp.watch("./src/sass/**/*.scss",["sass"]);
});
