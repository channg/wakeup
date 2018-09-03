# wakeup
<p align="left">
  <a href="https://travis-ci.org/channg/wakeup"><img alt="Travis Status" src="https://img.shields.io/travis/channg/wakeup/master.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/node-wakeup"><img alt="npm" src="https://img.shields.io/npm/v/node-wakeup.svg?style=flat-square"></a>
</p>

#### Pure front-end packaging tool
* Fast, zero-config by default.
* The entrance is an html
* Built-in support for CSS Sass Stylus Less
* .ts .vue support 
* Multiple js multiple stylesheets

### install
yarn
```
yarn global add node-wakeup
```
npm
```
npm i -g node-wakeup
```

### use  so easy
> Write a html  name `index.html`

then

```
wakeup watch
```
wakeup'll help you parse everything inside HTML, including js, CSS, and package it for you.

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="wake.css">
</head>
<body>
	<script src="index.js"></script>
</body>
</html>
```
You just need to write html according to your habits.


### sass less stylus ts vue

stylesheet

write `.less` `.styl` `.sass` in html
```
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="wake1.less">
    <link rel="stylesheet" href="wake2.styl">
    <link rel="stylesheet" href="wake3.sass">
</head>
```
script 

writ `.vue` `.ts` in html
```
<script src="index.ts"></script>
<script src="index2.vue"></script>
<script src="index3.js"></script>
```
> Script has two more options, wu-name and wu-format
> wu-name  is the name exposed to the global, the default is **the part before the point **
> wu-format is the package mode, the default **umd**
```
<script src="index.js" wu-name="kaak" wu-format="iife"></script>
```

### Only Two commands

Detect file changes and package them into the .wekeup directory
```
	wakeup watch // wu w
```
and  Bundles to dist directory

```
	wakeup build //wu b
```

a options is --index To change the name of the entry html
```
	wakeup build --index test.html // or wu b -i test
```


### Ok, we can work happily.