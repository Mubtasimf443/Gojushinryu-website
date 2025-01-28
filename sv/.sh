readonly Name="Mubtasim"
cd "C:\git\Client Project\gojushinryo\sv";
git add .;
echo "Give the name of commit"
read -p "commit Name ? " commit_name;
git commit -m "$commit_name";
git push -u origin main;