alias net-to-img="node ./cli.js"

RESOURCES=ftest/resources
OUTPUT=ftest/output

rm -rf $OUTPUT
mkdir -p $OUTPUT

echo "--> Running the command"
net-to-img --help
echo

echo "--> Basic case"
net-to-img $RESOURCES/arctic.gexf $OUTPUT/arctic.png

echo "--> Testing --no-layout"
net-to-img --no-layout $RESOURCES/arctic.gexf $OUTPUT/arctic-no-layout.png
