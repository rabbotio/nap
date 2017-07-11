# Ensure git flow exist
command -v git-flow >/dev/null 2>&1 || brew install git-flow

# Tag as version
tag=grep '"version":' package.json | cut -d\" -f4

# TODO : gen from sem-vers
echo $tag > ./msg.tmp

# Start release
git checkout develop
git push
git flow release start $tag
git flow release finish -m $tag $tag
git checkout master
git push
git checkout develop
git push
git branch -d release/$tag