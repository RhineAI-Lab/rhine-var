#!/usr/bin/env node

const readline = require('readline')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const PROJECT1_PATH = path.resolve(__dirname, '../')

function checkPackageJson(projectPath) {
  if (!fs.existsSync(path.join(projectPath, 'package.json'))) {
    console.error(`package.json file not found in ${projectPath}`)
    process.exit(1)
  }
}

function getCurrentVersion(projectPath) {
  const packageJson = require(path.join(projectPath, 'package.json'))
  return packageJson.version
}

function updateVersion(projectPath, newVersion) {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const packageLockPath = path.join(projectPath, 'package-lock.json')

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  packageJson.version = newVersion
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  if (fs.existsSync(packageLockPath)) {
    const packageLockJson = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'))
    packageLockJson.version = newVersion
    fs.writeFileSync(packageLockPath, JSON.stringify(packageJson, null, 2))
  }
}

function executeGitCommit(projectPath, commitMessage) {
  try {
    execSync('git add .', { cwd: projectPath, stdio: 'inherit' })
    execSync(`git commit -m "${commitMessage}"`, { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`Error executing commit command in ${projectPath}`)
    process.exit(1)
  }
}

function createGitTag(projectPath, version) {
  try {
    execSync(`git tag v${version}`, { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`Error creating git tag in ${projectPath}`)
    process.exit(1)
  }
}

function executeGitPush(projectPath) {
  try {
    execSync('git push --follow-tags', { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`Error executing push command in ${projectPath}`)
    process.exit(1)
  }
}

function getCommitMessage() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    console.log('Please enter commit message')
    rl.question('> ', (answer) => {
      rl.close()
      if (!answer) {
        console.error('Commit message cannot be empty')
        process.exit(1)
      } else {
        resolve(answer)
      }
    })
  })
}

function executeBuild(projectPath) {
  try {
    console.log(`\nBuilding project...`)
    execSync('npm run build', { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`Build failed in ${projectPath}`)
    process.exit(1)
  }
}

function executePublish(projectPath) {
  try {
    console.log(`\nPublishing package...`)
    execSync('npm publish', { cwd: projectPath, stdio: 'inherit' })
  } catch (error) {
    console.error(`Publish failed in ${projectPath}`)
    process.exit(1)
  }
}

function incrementVersion(version) {
  const parts = version.split('.')
  const patch = parseInt(parts[2], 10) + 1
  return `${parts[0]}.${parts[1]}.${patch}`
}

async function main() {
  checkPackageJson(PROJECT1_PATH)

  const currentVersion = getCurrentVersion(PROJECT1_PATH)
  const newVersion = incrementVersion(currentVersion)
  console.log(`New version: ${currentVersion} -> ${newVersion}`)
  console.log('')

  const commitMessage = await getCommitMessage()
  console.log('\n')

  console.log(`Updating project: ${PROJECT1_PATH}`)
  updateVersion(PROJECT1_PATH, newVersion)
  console.log('')
  executeGitCommit(PROJECT1_PATH, commitMessage)
  console.log('')
  createGitTag(PROJECT1_PATH, newVersion)
  console.log('')

  console.log(`Pushing project: ${PROJECT1_PATH}`)
  console.log('')
  executeGitPush(PROJECT1_PATH)
  console.log('')

  console.log(`Building project: ${PROJECT1_PATH}`)
  executeBuild(PROJECT1_PATH)
  console.log('')

  console.log(`Publishing project: ${PROJECT1_PATH}`)
  executePublish(PROJECT1_PATH)
  console.log('')

  console.log(`\nSuccessfully committed, built and published version: ${newVersion}`)
}

main()
