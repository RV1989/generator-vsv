const gulp = require('gulp')
const path = require('path');
const util = require('util');
const gutil = require('gulp-util');
const exec = require('child_process').execSync;


// System constants later you should set your enviremont path for vsv en logistieke app
const scripter = '"C:\\Program Files (x86)\\Siemens\\Automation\\OpennessScripter\\OpennessScripter.exe"'
const logistiekApp = 'Logistiek'
const vsv = 'VSV'
// Project variables
// tia portal
const tiaProjectPath = '"' + 'C:\\Users\\Ceratec\\Documents\\Automation\\test_cli\\test_cli.ap14' + '"'
const plcName = '"plc"'
const hmiNames = ['"HMI_1"', '"HMI_2"']
// input files
const telegramLijst = '"' + path.join(__dirname, 'telegram.xlsx') + '"'
const tablesEn = '"' + path.join(__dirname, 'VSV', 'Table-VSV-Dunfrost_EN.xlsm') + '"'
const tablesFr = '"' + path.join(__dirname, 'VSV', 'Table-VSV-Dunfrost_FR.xlsm') + '"'
const tablesNl = '"' + path.join(__dirname, 'VSV', 'Table-VSV-Dunfrost_NL.xlsm') + '"'
const tableLength = 200
// builder output paths update input paths
const dbSource = '"' + path.join(__dirname, 'VSV', 'Sources', 'DB') + '"'
const fcSource = '"' + path.join(__dirname, 'VSV', 'Sources', 'FC') + '"'
const sourceTelegramLijst = '"' + path.join(__dirname, 'VSV', 'Sources', 'Telegramlijst') + '"'
const alarmSource = '"' + path.join(__dirname, 'Display') + '"'
//Scripter files to use
const updateDbSript = '"' + path.join(__dirname, 'Scripter', 'update_db.opns') + '"'
const compileAllDispScript = '"' + path.join(__dirname, 'Scripter', 'Compile_a_display.opns') + '"'


/*
*********
Watchers
*********
*/

// watches all changes in the VSV Source directory and updates in tia portal for each file that is changed
gulp.task('watch-all-update', () => {
  gutil.log("watching... " + dbSource.replace(/"/g, ''))
  gulp.watch('VSV/Sources/**/*.xml').on('change', function (file) {
    gutil.log(file.path)
    let filepath = '"' + file.path + '"'
    let onlyPath = path.dirname(file.path)
    let arr = onlyPath.split('\\')
    let exe = scripter + ' '
    let script = '/file:' + updateDbSript + ' '
    let variables = {}
    variables.ProjectPath = 'projectPath=' + tiaProjectPath + ' '
    variables.plcName = 'plcName=' + plcName + ' '
    variables.Xml = 'Xml=' + filepath + ' '
    if (arr[arr.length - 1] == 'Telegramlijst') {

      variables.folder = 'folder=' + '"/TCP-iP/"' + ' '
    } else {

      variables.folder = 'folder=' + '"/Program/"' + ' '
    }

    let cmd = exe + '/silent ' + script + variables.ProjectPath + variables.plcName + variables.Xml + variables.folder
    gutil.log(cmd)
    exec(cmd)
    return

  })
})

// watch all files that needs building
gulp.task('watch-all-build', ['watch-en', 'watch-fr', 'watch-nl', 'watch-telegramlijst'])

// watch english excel tables for changes on change the db gets build with the alarms and alarm tags
gulp.task('watch-en', () => {
  gutil.log("watching... " + tablesEn.replace(/"/g, ''))
  gulp.watch(tablesEn.replace(/"/g, ''), ['build-db', 'build-alarm-en'])
})
// watch Frensh excel tables and builds the french alarms
gulp.task('watch-fr', () => {
  gutil.log("watching... " + tablesFr.replace(/"/g, ''))
  gulp.watch(tablesFr.replace(/"/g, ''), ['build-alarm-fr'])
})
// watches the ducth excel tables and builds the dutch alarms
gulp.task('watch-nl', () => {
  gutil.log("watching... " + tablesNl.replace(/"/g, ''))
  gulp.watch(tablesNl.replace(/"/g, ''), ['build-alarm-nl'])
})
// on changes in telegram.xlsx build Telegramlist.xml
gulp.task('watch-telegramlijst', () => {
  gutil.log("watching... " + telegramLijst.replace(/"/g, ''))
  gulp.watch(telegramLijst.replace(/"/g, ''), ['build-telegramlijst']);

});

/*
*********
Builders
*********
*/
// Build Tables Db's + DB15
gulp.task('build-db', () => {
  let exe = vsv + ' '
  let inputArg = '/input=' + tablesEn + ' '
  let outputArg = '/db=' + dbSource + ' '
  let lenghtArg = '/lenght=' + tableLength + ' '
  let cmd = exe + inputArg + outputArg + lenghtArg
  gutil.log(cmd)
  exec(cmd)
  return
})
//build  Alarm list  in [en-US] and alarm tags
gulp.task('build-alarm-en', () => {
  let exe = vsv + ' '
  let inputArg = '/input=' + tablesEn + ' '
  let outputArg = '/al=' + alarmSource + ' '
  let lenghtArg = '/lenght=' + tableLength + ' '
  let languageArg = '/allang=' + 'en-US' + ' '
  let alarmTagArg = '/alonly=' + 'true' + ' '
  let alarmClassArg = '/alclass=' + 'true' + ' '
  let cmd = exe + inputArg + outputArg + lenghtArg + languageArg + alarmTagArg + alarmClassArg
  gutil.log(cmd)
  exec(cmd)
  return
})
// build Alarm list in [fr-FR] no tags
gulp.task('build-alarm-fr', () => {
  let exe = vsv + ' '
  let inputArg = '/input=' + tablesFr + ' '
  let outputArg = '/al=' + alarmSource + ' '
  let lenghtArg = '/lenght=' + tableLength + ' '
  let languageArg = '/allang=' + 'fr-FR' + ' '
  let alarmClassArg = '/alclass=' + 'true' + ' '
  let cmd = exe + inputArg + outputArg + lenghtArg + languageArg + alarmClassArg
  gutil.log(cmd)
  exec(cmd)
  return
})

// build Alarm list in [nl-BE] no tags
gulp.task('build-alarm-nl', () => {
  let exe = vsv + ' '
  let inputArg = '/input=' + tablesNl + ' '
  let outputArg = '/al=' + alarmSource + ' '
  let lenghtArg = '/lenght=' + tableLength + ' '
  let languageArg = '/allang=' + 'nl-BE' + ' '
  let alarmClassArg = '/alclass=' + 'true' + ' '
  let cmd = exe + inputArg + outputArg + lenghtArg + languageArg + alarmClassArg
  gutil.log(cmd)
  exec(cmd)
  return
})


// build telegramlijst.xml by opening logistiek app CLI
gulp.task('build-telegramlijst', () => {
  let exe = logistiekApp + ' '
  let iglaArg = '/igla=' + telegramLijst + ' '
  let oglaArg = '/ogla=' + sourceTelegramLijst + ' '
  let cmd = exe + iglaArg + oglaArg
  gutil.log(cmd)
  exec(cmd)
  return
})


/*
*********
Updaters
*********
*/
// do all the update tasks
gulp.task('update-all', ['update-db', 'update-fc', 'update-telegramlijst'])
// Loads xml file in dir vsv/sources/DB into tia portal
gulp.task('update-db', () => {
  let exe = scripter + ' '
  let script = '/file:' + updateDbSript + ' '
  let variables = {}
  variables.ProjectPath = 'projectPath=' + tiaProjectPath + ' '
  variables.plcName = 'plcName=' + plcName + ' '
  variables.Xml = 'Xml=' + dbSource + ' '
  variables.folder = 'folder=' + '"/Program/"' + ' '
  let cmd = exe + '/silent ' + script + variables.ProjectPath + variables.plcName + variables.Xml + variables.folder
  gutil.log(cmd)
  exec(cmd)
  return
})
// Loads xml files in dir vsv/sources/FC into tia portal
gulp.task('update-fc', () => {
  let exe = scripter + ' '
  let script = '/file:' + updateDbSript + ' '
  let variables = {}
  variables.ProjectPath = 'projectPath=' + tiaProjectPath + ' '
  variables.plcName = 'plcName=' + plcName + ' '
  variables.Xml = 'Xml=' + fcSource + ' '
  variables.folder = 'folder=' + '"/Program/"' + ' '
  let cmd = exe + '/silent ' + script + variables.ProjectPath + variables.plcName + variables.Xml + variables.folder
  gutil.log(cmd)
  exec(cmd)
  return
})

// load telegramlijst.xml into tia portal
gulp.task('update-telegramlijst', () => {
  let exe = scripter + ' '
  let script = '/file:' + updateDbSript + ' '
  let variables = {}
  variables.ProjectPath = 'projectPath=' + tiaProjectPath + ' '
  variables.plcName = 'plcName=' + plcName + ' '
  variables.Xml = 'Xml=' + sourceTelegramLijst + ' '
  variables.folder = 'folder=' + '"/TCP-IP/"' + ' '
  let cmd = exe + '/silent ' + script + variables.ProjectPath + variables.plcName + variables.Xml + variables.folder
  gutil.log(cmd)
  exec(cmd)
  return

})

/*
**********
Tia portal
**********
*/

//Compile all displays
gulp.task('compile-all-displays', () => {
  let exe = scripter + ' '
  let script = '/file:' + compileAllDispScript + ' '
  let variables = {}
  variables.ProjectPath = 'projectPath=' + tiaProjectPath + ' '
  hmiNames.forEach((hmiName) => {
    variables.hmiName = 'hmiName=' + hmiName + ' '
    let cmd = exe + '/silent ' + script + variables.ProjectPath + variables.hmiName
    gutil.log(cmd)
    exec(cmd, (error, stdout, stderr) => {
      gutil.log(stdout);
    });


  })
  return


})
