readonly Name="Mubtasim"
cd "C:\git\Client Project\gojushinryo\sv";
git add .;
echo "Give the name of commit"
read -p "commit Name ? " commit_name;
git commit -m "$commit_name";
git push -u origin main;
commitToGithub(){
    echo "## Commited : $commit_name"
    echo "Commited To Github finished successFully";
}
commitToGithub;
f(){
    a=0;
    let a=$1+$2;
    echo a;
}
f 100 2000;