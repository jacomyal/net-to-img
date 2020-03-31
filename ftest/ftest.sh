alias net-to-img="node ./cli.js"

OUTPUT=ftest/output

mkdir -p $OUTPUT

net-to-img -h || true
