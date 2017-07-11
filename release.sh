run() {
  # Ensure git flow exist
  command -v git-flow >/dev/null 2>&1 || brew install git-flow

  # Tag as version
  tag=$(grep '"version":' package.json | cut -d\" -f4)

  # Start release
  git checkout develop
  git push
  git flow release start $tag
  git flow release finish -m $tag $tag
  git checkout master
  git push
  git checkout develop
  git push
  git branch -d release/$tag >/dev/null 2>&1
}

# Process
PROCESS='release'
echo -e "$(tput setaf 3)[$PROCESS] : Begin$(tput sgr0)"
run
echo -e "$(tput setaf 2)[$PROCESS] : End$(tput sgr0)"