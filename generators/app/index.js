'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the exceptional ' + chalk.red('generator-vsv') + ' generator!'
    ));

    const prompts = [{
        name: 'name',
        message: 'What is the projects name?',
        default: this.appname // Default to current folder name
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'would you like to make this a git repo?',
      }, {
        when: function (props) {
          return props.git;
        },
        name: 'repo',
        message: 'link to repo?'
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  writing() {
    //['/S7', '/Display/Images', '/Drive', '/Safety', '/Communication', '/Scheme']
    mkdirp.sync(path.join(this.destinationPath(), 'S7'));
    mkdirp.sync(path.join(this.destinationPath(), 'Display/Images'));
    mkdirp.sync(path.join(this.destinationPath(), 'Drive'));
    mkdirp.sync(path.join(this.destinationPath(), 'Safety'));
    mkdirp.sync(path.join(this.destinationPath(), 'Communication'));
    mkdirp.sync(path.join(this.destinationPath(), 'Scheme'));
    this.fs.copy(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js'));
    this.fs.copy(
      this.templatePath('_Compile_a_display.opns'),
      this.destinationPath('Scripter/' + 'Compile_a_display.opns'));
    this.fs.copy(
      this.templatePath('_Update_db.opns'),
      this.destinationPath('Scripter/' + 'Update_db.opns'));

    this.fs.copy(
      this.templatePath('_Table-VSV-Logistiek EN.xlsm'),
      this.destinationPath('VSV/' + 'Table-VSV-' + this.props.name + ' EN.xlsm'));
    this.fs.copy(
      this.templatePath('_Table-VSV-Logistiek FR.xlsm'),
      this.destinationPath('VSV/' + 'Table-VSV-' + this.props.name + ' FR.xlsm'));
    this.fs.copy(
      this.templatePath('_Table-VSV-Logistiek NL.xlsm'),
      this.destinationPath('VSV/' + 'Table-VSV-' + this.props.name + ' NL.xlsm'));
    this.fs.copy(
      this.templatePath('_Fout routine 3_4_Tia portal.scl'),
      this.destinationPath('VSV/Sources/' + 'Fout routine 3_4_Tia portal.scl'));
    this.fs.copy(
      this.templatePath('_General VSV.xml'),
      this.destinationPath('VSV/Sources/DB/' + 'General VSV.xml'));

    mkdirp.sync(path.join(this.destinationPath(), 'VSV/Sources/FC'));
    mkdirp.sync(path.join(this.destinationPath(), 'VSV/Sources/Telegramlijst'));
    mkdirp.sync(path.join(this.destinationPath(), 'VSV/Sources/Drives'));



    if (this.props.git) {
      //console.log (this.props.repo);
      this.spawnCommandSync('git', ['init']);
      this.spawnCommandSync('git', ['remote', 'add', 'origin', this.props.repo]);
      this.spawnCommandSync('git', ['add', '--all']);
      this.spawnCommandSync('git', ['commit', '-m', '"Project created with yeoman vsvgenerator"']);
    }


  }

};
