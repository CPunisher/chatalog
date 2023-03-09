host=${HOST:-0.0.0.0}
port=${PORT:-4000}

pnpm run build

node ./dist/chatalog-cli/index.js datalog -t $(pwd)/templates/1_all_name_content.js ~/github/egs-artifact/egs/benchmarks/kd_bench/grandparent/ \
  | xargs -0 -I {} sh -c "echo {} && curl $host:$port -X POST -H "Content-Type: application/json" -d '{ "message": {}}'"