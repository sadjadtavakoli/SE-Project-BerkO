const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const nodeprofCommand = require('../settings').nodeprofCommand
var assert = require('assert');

// describe('Test callChain.js', () => runTest('callChain.js'));
// describe('Test callbackSingleKnownFunction.js', () => runTest('callbackSingleKnownFunction.js'));
// describe('Test callbackSingleUnknownFunction.js', () => runTest('callbackSingleUnknownFunction.js'));
// describe('Test callbackUnknownChain.js', () => runTest('callbackUnknownChain.js'));
// describe('Test functionCall_1.js', () => runTest('functionCall_1.js'));
// describe('Test functionCall_2.js', () => runTest('functionCall_2.js'));
// describe('Test functionCall_3.js', () => runTest('functionCall_3.js'));
describe('Test functionCall_4.js', () => runTest('functionCall_4.js'));
// describe('Test timeoutFakeKnownFunction.js', () => runTest('timeoutFakeKnownFunction.js'));
// describe('Test timeoutMultipleNestedTimeouts.js', () => runTest('timeoutMultipleNestedTimeouts.js'));
// describe('Test timeoutMultipleTimeouts.js', () => runTest('timeoutMultipleTimeouts.js'));
// describe('Test timeoutSingleKnownFunction.js', () => runTest('timeoutSingleKnownFunction.js'));
// describe('Test timeoutSingleUnknownFunction.js', () => runTest('timeoutSingleUnknownFunction.js'));



function runTest(item) {
  it('Run nodeprof', function (done) {
    this.timeout(10000);
    execute(nodeprofCommand + "/test/unit_tests/" + item, done)
    // done()
  });
  it('Compare resutl', function (done) {
    let diffs = compairResult(item);
    if(diffs.length > 0){
      assert.fail(JSON.stringify(diffs,null,'\t'));
    }
    done();
  });
}
function execute(command, done) {
  exec(command, (err, stdout, stderr) => {
    process.stdout.write(stdout)
    done()
  })
}

function compairResult(fileName) {
  let expectedOutput = fs.readFileSync(path.join(__dirname, 'expectedOutputs' + path.sep + fileName), { encoding: 'utf8' }).split('\n')
  let analyzerOutput = fs.readFileSync(path.join(__dirname, 'analyzerOutputs' + path.sep + fileName), { encoding: 'utf8' }).split('\n')
  let min_content = expectedOutput
  let max_content = 'expected output'

  if (analyzerOutput.length < expectedOutput.length) {
    min_content = analyzerOutput
    max_content = 'analyzer result'
  }
  let diffs = []
  for (let i in min_content) {
    if(expectedOutput[i] !== analyzerOutput[i]){
      diffs.push({
        'line_number' : i,
        'expected' : expectedOutput[i],
        'actual' : analyzerOutput[i]
      })
    }
  }
  if (analyzerOutput.length !== expectedOutput.length) {
    diffs.push(max_content + ' has some extra lines!')
  }
return diffs
}