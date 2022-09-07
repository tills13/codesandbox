set -x

for dir in $( ls )
do
    if [ -d $dir ]; then
        pushd $dir
        docker build . -t "cs_${dir}:latest"
        popd
    fi
done
