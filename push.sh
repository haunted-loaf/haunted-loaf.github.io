set -e
rm -rf .git
rm -rf docs
bun run build
touch docs/.nojekyll
git init .
git config user.email "haunty@bread.social"
git config user.name "Haunted Loaf"
git config --add --local core.sshCommand "ssh -i ~/.ssh/id_haunty"
git branch -m main
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:haunted-loaf/haunted-loaf.github.io
git push --force --set-upstream origin main
# git subtree push --prefix output origin gh-pages
