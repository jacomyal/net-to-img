alias net-to-img="node ./cli.js"

RESOURCES=ftest/resources
OUTPUT=ftest/output

rm -rf $OUTPUT
mkdir -p $OUTPUT

echo "--> Running the command"
net-to-img --help
echo

echo "--> Basic case"
net-to-img $RESOURCES/arctic.gexf -o $OUTPUT/basic-arctic.png

echo "--> Testing '--no-layout'"
net-to-img --no-layout $RESOURCES/arctic.gexf -o $OUTPUT/arctic-no-layout.png

echo "--> Testing without output path"
cp $RESOURCES/arctic.gexf $OUTPUT
net-to-img $OUTPUT/arctic.gexf --no-layout

echo "--> Testing from stdin"
cat $RESOURCES/arctic.gexf | net-to-img -f gexf --no-layout -o $OUTPUT/arctic-from-stdin.gexf

echo "--> Keeping only largest component"
net-to-img $RESOURCES/components.json -o $OUTPUT/components.png --largest-component

echo "--> Testing lib usage"
node ./ftest/lib-usage.js $OUTPUT/clusters-lib.png
