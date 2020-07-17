// 注意保留缩进
const cmd = `if [ $env != 'product' ]
    then
        npm run build:\$\{env\}
    else
        npm run build
    fi
`;

// 处理pack.sh文件
module.exports = async function() {
  const actions = [
    {
      type: 'modify',
      files: 'pack.sh',
      handler(data) {
        data = data.replace('. ./run.sh $env', cmd);
        return data
      }
    }
  ];
  return actions;
}
