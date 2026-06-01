const { spawn } = require('child_process');

console.log("🚀 Iniciando push de esquema automatizado...");
const child = spawn('bun', ['run', 'drizzle-kit', 'push:sqlite'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

child.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  if (output.includes("Do you still want to push changes?")) {
    console.log("\n🎯 [Automatización] Detectado prompt de confirmación. Enviando Flecha Abajo + Enter para confirmar...");
    // Envía Flecha abajo (\u001b[B) para seleccionar la opción "Yes..."
    child.stdin.write('\u001b[B');
    setTimeout(() => {
      child.stdin.write('\n');
    }, 200);
  }
});

child.on('close', (code) => {
  console.log(`🏁 Proceso finalizado con código: ${code}`);
  process.exit(code);
});
