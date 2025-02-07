# بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
# InshaAllah, By his marcy I will Gain Success 
cd ..;
git add .;
echo "Give the name of commit"
read -p "commit message : " commit_name;
git commit -m "$commit_name";
git push -u origin main;
commitToGithub(){
    echo "## Commited : $commit_name"
    echo "Commited To Github finished successFully";
}
commitToGithub;