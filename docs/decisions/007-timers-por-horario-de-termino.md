# 007: Timers pelo horário de término

**Status:** aceita · setembro de 2026

## Contexto

No modo cozinha, a pessoa troca de app ou deixa o celular de lado. Com o app em segundo plano, o sistema atrasa ou
pausa os intervalos (`setInterval`). Um timer que desconta 1 segundo a cada "tique" fica atrasado.

## Decisão

- Cada timer guarda o **horário de término** (`endAt = Date.now() + duração`). O tempo restante é calculado:
  `endAt - agora`.
- Pausar guarda o restante; retomar cria um novo `endAt`.
- Um relógio só (`useTimerAlarms`) atualiza a tela a cada meio segundo e também quando o app volta ao primeiro plano.
- Os timers ficam num store Zustand **sem persistência**: são descartados ao sair do modo cozinha.
- Ao terminar: vibração, resposta tátil (`expo-haptics`), bipe (`expo-audio`, tocando mesmo no modo silencioso) e
  anúncio para o leitor de tela.

## Consequências

- Voltar ao app depois de 5 minutos mostra o tempo certo na hora.
- O alarme só toca com o app aberto. Tocar com o app fechado exige `expo-notifications`, que no Expo Go do Android
  tem limitações; fica como evolução para quando o app usar um development build.
