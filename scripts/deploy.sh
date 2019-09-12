cd ./terraform
terraform apply -auto-approve
$bucket_url=`terraform output bucket_url`

cd ../app
ng build -c production
gsutil -m rsync -rd ./dist/google-barnard $bucket_url
gsutil -m setmeta -h 'Content-Type:text/javascript' $bucket_url/**/*.js