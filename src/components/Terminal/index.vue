<template>
    <div 
        v-show="terminalAppState.terminalApp.active"
        ref="terminalElement"
        class="terminal-app"
        @click="focusWriteLine"
        :class="{ 
            'terminal-app-maximized': terminalMaximized,
            'terminal-app-minimize': showMinimizeAnimation,
            'terminal-app-resize': resizeTerminalMode
        }">
            <header :draggable="true" @drag="dragTerminal">
                <button 
                    @click="closeTerminalApp"
                    class="window-operation-button close-button">
                    <close-icon
                        :size="14"
                        fillColor="#1d1d1db3"
                    />
                </button>
                <button 
                    class="window-operation-button minimize-button" 
                    @click="toggleTerminalApp">
                    <minimize-icon
                        :size="14"
                        fillColor="#1d1d1db3"
                    />
                </button>
                <button 
                    class="window-operation-button maximize-button"
                    @click="maximizeTerminalApp">
                    <maximize-icon
                        :size="14"
                        fillColor="#1d1d1db3"
                    />
                </button>
                <h1 class="terminal-title">{{ terminalUser }}{{  terminalPath }}</h1>
            </header>
            <main ref="terminalContent">
                <ul ref="linesElement" class="lines">
                    <li class="line" v-for="command in commandLines" :key="command" :style="`margin-top: ${command.style?.marginTop}; margin-bottom: ${command.style?.marginBottom}`">
                        <p v-show="!command.systemMessage">
                            <span class="user-name">
                                {{ command.user }}
                            </span>
                            <span class="current-path">
                                {{ command.directory }}
                            </span>
                        </p>
                        <input 
                            v-show="!command.systemMessage"
                            type="text"
                            :value="command.command"
                            disabled
                        />
                        <div 
                            v-show="command.systemMessage"
                            class="system-command-response">
                            <p :class="command.class">
                                {{ command.command }}
                                <span 
                                    v-for="children in command.childrens" 
                                    :class="children.class"
                                    :key="children">{{ children.text }}</span>
                            </p>
                        </div>
                    </li>
                    <li class="line">
                        <p>
                            <span class="user-name">
                                {{ terminalUser }}
                            </span>
                            <span class="current-path">
                                {{ terminalPath }}
                            </span>
                        </p>
                        <input 
                            type="text"
                            v-model="currentComandLine"
                            class="input-command-line"
                        />
                    </li>
                </ul>
            </main>
        </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "TerminalApp"
    });
</script>

<script setup lang="ts">
    import { useStore } from 'vuex';
    import { RootState } from "@/store";
    import { ref, defineProps, computed, watch, onMounted } from 'vue';

    import CloseIcon from "vue-material-design-icons/WindowClose.vue";
    import MinimizeIcon from "vue-material-design-icons/WindowMinimize.vue";
    import MaximizeIcon from "vue-material-design-icons/WindowMaximize.vue";

    interface ITerminalAppProps {
        positionX: number;
        positionY: number;
    }

    interface ICommandLineResponseChildren {
        text: string;
        class?: string;
        type: string;
    }

    interface ICommandLine {
        user: string;
        directory: string;
        command: string;
        systemMessage: boolean;
        class?: string;
        childrens?: ICommandLineResponseChildren[];
        style?: {
            marginTop?: string;
            marginBottom?: string 
        }
    }

    const props = defineProps<ITerminalAppProps>();

    const store = useStore<RootState>();

    const currentComandLine = ref<string>("");
    const resizeTerminalMode = ref<boolean>(false);
    const showMinimizeAnimation = ref<boolean>(false);
    const terminalUser = ref<string>("gjeronimo@ubuntu:");
    const terminalPath = ref<string>("~/cv$");
    const terminalMaximized = ref<boolean>();

    const linesElement = ref<HTMLElement>();
    const terminalElement = ref<HTMLElement>();

    const terminalContent = ref<HTMLElement>();

    const commandLines = ref<ICommandLine[]>([
        {
            command: "Olá, meu nome é Gabriel Jeronimo e sou desenvolvedor de software. Este é o meu site pessoal, onde você pode conhecer um pouco mais sobre mim, minhas competências e experiências, além de entrar em contato comigo. Tudo isso de uma forma divertida e diferente, através de um terminal de comandos. Não se preocupe, não será difícil, mas será uma experiência única.",
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: true
        },
        {
            command: 'Que tal começarmos? Para saber mais sobre mim e como navegar por esse terminal, execute o comando (sem aspas) "cat welcome.txt" para ler o arquivo de boas-vindas que irá te guiar.',
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: true,
            style: {
                marginTop: "10px",
                marginBottom: "10px"
            }
        }
    ]);

    const backupCommandLines = ref<ICommandLine[]>();

    const mainDirectory = ref<ICommandLineResponseChildren[]>([
        {
            text: "presentation",
            class: "directory",
            type: "directory"
        },
        {
            text: "scripts",
            class: "directory",
            type: "directory"
        },
        {
            text: "welcome.txt",
            type: "file"
        },
        {
            text: "README.txt",
            type: "file",
        },
        {
            text: "file-recognition.sh",
            class: "script",
            type: "program"
        },
        {
            text: "thais.sh",
            class: "script",
            type: "program"
        },
    ]);

    const presentationDirectory = ref<ICommandLineResponseChildren[]>([
        {
            text: "skills.txt",
            type: "file"
        },
        {
            text: "soft-skills.txt",
            type: "file"
        },
        {
            text: "experiences.txt",
            type: "file"
        },
        {
            text: "README.txt",
            type: "file"
        },
        {
            text: "gabriel-jeronimo.txt",
            type: "file"
        },
        {
            text: "file-recognition.sh",
            class: "script",
            type: "program"
        },
    ]);

    const scriptsDirectory = ref<ICommandLineResponseChildren[]>([
        {
            text: "social_network.py",
            class: "script",
            type: "program"
        },
        {
            text: "contact.py",
            class: "script",
            type: "program"
        },
        {
            text: "download-cv.py",
            class: "script",
            type: "program"
        },
        {
            text: "README.txt",
            type: "file"
        },
        {
            text: "file-recognition.sh",
            class: "script",
            type: "program"
        },
    ]);

    const skills = [
        'Python',
        'JavaScript',
        'TypeScript',
        'HTML',
        'CSS',
        'Flutter',
        'React',
        'ReactNative',
        'VueJS',
        'Ionic',
        'Dart',
        'Matplotlib',
        'AWS (Lambda, EC2, RDS, S3, etc)',
        'Firebase (Store, Cloud Message, Real time database)',
        'Prisma',
        'MySQL',
        'PostgreSQL',
        'MongoDB',
        'Stripe',
        'GraphQL',
        'REST',
        'Selenium',
        'Puppeter',
        'Django',
        'Flask',
        'Redis',
        'RabbitMQ',
        'TensorFlow',
        'Docker',
        'GIT/GitHub/Bitbcket/GitLab',
        'SOLID',
        'JEST',
        'Cypress',
        "Figma",
        "Trello",
        "Jira",
        "Bitrix24"
    ];

    // function getWindowSize(){
    //     return {
    //         windowWidth: window.innerWidth,
    //         windowHeight: window.innerHeight
    //     }
    // }

    function identifyKeyboardCommand(){
        if (terminalElement.value){
            terminalElement.value.addEventListener("keydown", keyboardEvent => {
                // F4: Comando para fechar o terminal
                if (store.state.terminalApp.active){
                    if (keyboardEvent.shiftKey && keyboardEvent.code === 'F4') {
                        closeTerminalApp();
                    }
                }
                
                // F11: Comando para maximizar a janela do terminal
                if (keyboardEvent.code === 'F11') {
                    maximizeTerminalApp();
                }

                // Enviar um comando
                if (keyboardEvent.code === "Enter"){
                    processCommandLine(currentComandLine.value);
                    currentComandLine.value = "";
                }

                // Voltar comando antigo
                if (keyboardEvent.code === "ArrowUp"){
                    if (backupCommandLines.value){
                        const { command } = backupCommandLines.value[backupCommandLines.value.length - 1];
                        currentComandLine.value = command;
                    }
                }

                // Limpar comandos na tela 
                if (keyboardEvent.shiftKey && keyboardEvent.key.toLowerCase() === "l"){
                    commandLines.value = [];
                    currentComandLine.value = "";
                }
            });
        }
    }

    function getTerminalSize(){
        return {
            terminalWidth: terminalElement.value?.getBoundingClientRect().width ? 
                terminalElement.value?.getBoundingClientRect().width : 0,
            terminalHeight: terminalElement.value?.getBoundingClientRect().height 
                ? terminalElement.value?.getBoundingClientRect().height : 0,
            terminalPositionX: terminalElement.value?.getBoundingClientRect().x 
                ? terminalElement.value?.getBoundingClientRect().x : 0,
            terminalPositionY: terminalElement.value?.getBoundingClientRect().y
                ? terminalElement.value?.getBoundingClientRect().y : 0,
        }
    }

    function dragTerminal(event: DragEvent){
        const { terminalWidth } = getTerminalSize();

        terminalMaximized.value = false;

        if (!terminalMaximized.value){
            if (terminalElement.value){
                terminalElement.value.style.top = `${event.clientY}px`;
                terminalElement.value.style.left = `${event.clientX}px`;
            }
        }
    }

    function toggleTerminalApp(){
        store.commit("TOGGLE_TERMINAL_APP");
    }

    function maximizeTerminalApp(){
        terminalMaximized.value = !terminalMaximized.value;
    }

    function closeTerminalApp(){
        commandLines.value = [];
        currentComandLine.value = "";
        commandLines.value.push({
            command: "Olá, meu nome é Gabriel Jeronimo e sou desenvolvedor de software. Este é o meu site pessoal, onde você pode conhecer um pouco mais sobre mim, minhas competências e experiências, além de entrar em contato comigo. Tudo isso de uma forma divertida e diferente, através de um terminal de comandos. Não se preocupe, não será difícil, mas será uma experiência única.",
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: true
        },
        {
            command: 'Que tal começarmos? Para saber mais sobre mim e como navegar por esse terminal, execute o comando (sem aspas) "cat welcome.txt" para ler o arquivo de boas-vindas que irá te guiar.',
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: true,
            style: {
                marginTop: "10px"
            }
        });
        store.commit("SET_APP_RUNNING_STATUS", false);
        toggleTerminalApp();
    }

    function thaisProgram(commandLine: string, commandOptions: string[]){
        if (commandOptions[0] !== "--password" || !commandOptions[0])
            return commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: `${commandLine}: Flag --password deve ser informada!`,
                systemMessage: true
            });

        if (commandOptions[1] !== "naosei")
            return commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: `${commandLine}: A senha informada está incorreta!`,
                systemMessage: true
            });

        return commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: "Eu te amo Thais ❤️",
            systemMessage: true,
            class: "ilove-you"
        });
    }

    function readFilesProgram(commandLine: string, commandOptions: string[]){
        if (commandOptions.length === 0)
            return commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: `Arquivo não especificado!`,
                systemMessage: true
            });

        const [ filename, extension ] = commandOptions[0].split(".");

        if (extension === "py" || extension === "sh")
            return commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: `Arquivo "${commandOptions[0]}" é um programa. Programas não podem ser lidos, apenas executados.`,
                systemMessage: true
            });

        if (commandOptions[0] === "welcome.txt" && terminalPath.value === "~/cv$"){
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: "Muito bem, viu como foi fácil? Haha.",
                systemMessage: true
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: "Bom, vamos falar então sobre como obter informações através desse terminal. Todas as informações são contidas dentro de arquivos, pastas ou programas. Mas, Gabriel, como identificar um arquivo, uma pasta ou um programa? Simples:",
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Arquivos de leitura: São destacados em branco e possuem o final ".txt".',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Pastas (Diretórios): São destacados em azul, elas levam a outros lugares do sistema, onde pode obter mais informações.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Programas executáveis: São destacados em verde e possuem o final ".py" ou ".sh".',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Mas se você ainda tiver dúvidas sobre como identificar, não se preocupe. Há um programa padrão instalado para ajudar nisso. Para usá-lo, basta executar o comando (sem aspas) "./file-recognition.sh --type" e, em seguida, o nome do arquivo que você deseja identificar. Por exemplo, se você quer saber se o arquivo "skills.txt" é um arquivo de leitura, uma pasta ou um programa executável, basta digitar o comando "./file-recognition.sh --type skills.txt". O programa dará 4 possíveis respostas:',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '1 - Arquivo não encontrado!',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '2 - Arquivo de leitura.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '3 - Pasta acessível.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '4 - Programa executável.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Entenda que arquivos e programas só podem ser executados se você estiver na mesma pasta que eles. Uma dica valiosa também é que em todas as pastas em que você se encontra existe um arquivo chamado "README.txt". Esse arquivo contém informações sobre todo o conteúdo presente na pasta e para que eles servem. É sempre uma boa ideia ler esse arquivo antes de começar a explorar a pasta em busca de informações.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Fácil, não?',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Agora, que tal conhecer a lista de comandos disponíveis? Basta utilizar o comando (sem aspas) "help" para listar todos os comandos que você pode utilizar, juntamente com suas respectivas descrições. Através do comando "help", você aprenderá como acessar pastas, ler arquivos e executar programas. Vamos tentar?',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });
            return;
        }

        if (commandOptions[0] === "README.txt" && terminalPath.value === "~/cv$"){
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Opa! Ai sim, você está pegando o jeito, haha! Aqui está uma descrição de todo conteúdo disponível nesta pasta atual:',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"presentation": Essa pasta contém todos os arquivos de texto relacionados a mim, incluindo informações sobre minhas experiências, habilidades e comportamentos.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"scripts": Essa pasta contém todos os arquivos de programas que podem ser executados. Aqui você encontrará programas relacionados às minhas redes sociais, como também programas para entrar em contato comigo.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"welcome.txt": Este é o arquivo de boas-vindas que você leu no início, que contém instruções sobre como se guiar através desse terminal.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"file-recognition.sh": Arquivo de programa executável para reconhecimento de arquivos, use o comando "help" para obter informações de como executar programas com final ".sh".',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"README.txt": É esse atual arquivo que você está lendo. Haha.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"thais.sh": Uma brincadeira entre mim e minha namorada chata. Não se preocupe com isso. Haha.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Lembre-se de que todas as pastas que você acessa possuem um arquivo "README.txt" como este, que contém descrições sobre o conteúdo presente. É uma boa ideia ler esses arquivos para entender melhor o que cada pasta contém.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });
            return;
        }

        if (commandOptions[0] === "README.txt" && terminalPath.value === "~/cv/presentation$"){
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Olá novamente! Nesta pasta, você encontrará diversos arquivos que contêm informações importantes sobre minhas capacidades técnicas e sociais, bem como minha trajetória profissional na área. Segue abaixo todo o conteúdo presente nesta pasta e suas descrições:',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"skills.txt": Neste arquivo, você poderá encontrar algumas das minhas habilidades técnicas que utilizo para desenvolver softwares e atuar no ramo de desenvolvimento, bem como para gerenciar projetos, tanto em equipe como individualmente.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"soft-skills.txt": Neste arquivo, você encontrará mais detalhes sobre minha personalidade, a forma como me comporto e atuo em equipe, além das minhas habilidades sociais em geral.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"experiences.txt": Neste arquivo, você encontrará mais detalhes sobre minhas experiências profissionais atuando em empresas e como autônomo.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"README.txt": É esse atual arquivo que você está lendo. Haha.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"gabriel-jeronimo.txt": Neste arquivo, falo um pouco sobre como conheci a área, como iniciei meus estudos e entrei no ramo de desenvolvimento.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"file-recognition.sh": Arquivo de programa executável para reconhecimento de arquivos, use o comando "help" para obter informações de como executar programas com final ".sh".',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            return;
        }

        if (commandOptions[0] === "README.txt" && terminalPath.value === "~/cv/scripts$"){
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Nessa pasta, você encontrará a maioria dos programas executáveis, que foram criados com a finalidade de permitir o acesso às minhas redes sociais, fazer o download do meu currículo e entrar em contato comigo. Lembre-se de que programas com a extensão ".py" só podem ser executados utilizando o comando "python". Para obter uma melhor compreensão de como usar o comando "python", digite "help" para ver uma descrição de todos os comandos disponíveis no sistema.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"social_network.py": Programa destinado a acessar minhas redes sociais. Para utilizá-lo, execute o comando "python social_network.py --help", onde será exibido um tutorial de como desfrutar de todas as funcionalidades deste programa.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"contact.py": Este programa é destinado a entrar em contato comigo diretamente por meio deste sistema. Você pode deixar sua mensagem armazenada em meu servidor e, em até 24 horas, responderei diretamente em seu e-mail ou meio de contato disponível. Para utilizá-lo, execute o comando "python contact_me.py --help", onde será exibido um tutorial de como desfrutar de todas as funcionalidades deste programa.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });
            
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"download-cv.py": Este programa permite que você baixe meu currículo diretamente pelo sistema. Para usá-lo, basta executar o comando "python download-cv.py". Não é necessário utilizar nenhuma flag adicional. Após a execução, um arquivo PDF será baixado para o seu computador.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"README.txt": É esse atual arquivo que você está lendo. Haha.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '"file-recognition.sh": Arquivo de programa executável para reconhecimento de arquivos, use o comando "help" para obter informações de como executar programas com final ".sh".',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });
            return;
        }

        if (commandOptions[0] === "gabriel-jeronimo.txt" && terminalPath.value === "~/cv/presentation$"){
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Eu já me apresentei anteriormente, mas para reforçar, meu nome é Gabriel Jeronimo Machado Schimidt de Camargo. Tenho 21 anos e atualmente trabalho como desenvolvedor de software. Nos outros arquivos que você já leu ou ainda lerá, falo sobre minha carreira profissional. Neste, vou contar mais sobre minha história pessoal e como entrei na área.',
                systemMessage: true
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Nasci em Indaiatuba, interior de São Paulo, em 10/06/2002. Desde criança, fui apaixonado por tecnologia, mas meu contato com a internet, celulares e computadores em geral era limitado, pois morava em uma região afastada. Isso mudou aos 10 anos, quando ganhei meu primeiro computador do meu primo Danilo. A partir daí, comecei a estudar sobre tecnologia e era considerado pelos meus amigos como uma espécie de enciclopédia ambulante sobre celulares e peças de computadores.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Em 2016, tudo mudou. Conheci a programação por meio de uma eletiva de robótica na escola Hélio Cerqueira Leite. Montávamos coisas básicas como semáforos e usávamos C++ para programar. A partir daí, decidi que a tecnologia era minha vocação e comecei a estudar mais a fundo técnicas de invasão. Meus primeiros projetos foram na área de segurança da informação, mas, como um adolescente bobão, acabei me metendo em problemas por hackear contas de outras pessoas. Porém, meu foco mudou completamente quando percebi que queria seguir nessa área e comecei a estudar tecnologias que o mercado precisava.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Não tinha condições de ter um computador, mas não deixei isso me desanimar. Estudei durante anos usando apenas o meu celular e atuei em projetos como freelancer. Foi difícil, cansativo e frustrante, mas minha determinação me manteve focado. Fiz muitas gambiarras para executar certas coisas, mas isso me deixou calejado e me aprimorou em resolver problemas. Finalmente, quando completei 18 anos, consegui um emprego na MPlan Sistemas em Campinas. Era uma outra cidade, então pegava o ônibus todas as manhãs. No primeiro dia de trabalho, comprei um notebook da Positivo, minha primeira grande compra. A partir desse momento, as coisas começaram a fluir e continuo trabalhando nessa área até hoje.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Não me arrependo de ter escolhido essa carreira e espero nunca sair desse ramo. Apesar de estressante, é minha vocação.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            return;
        }

        if (commandOptions[0] === "skills.txt" && terminalPath.value === "~/cv/presentation$"){
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Eu sou um desenvolvedor fullstack, cujas habilidades variam entre o cenário de front-end, back-end, mobile e dados, incluindo visão computacional. Segue abaixo uma lista das habilidades que domino e tenho experiência, lembrando que não se trata apenas de linguagens de programação, mas também de design patterns e ferramentas.',
                systemMessage: true,
            });

            skills.forEach((skill, index) => {
                if (index === 0){
                    return commandLines.value.push({
                        user: terminalUser.value,
                        directory: terminalPath.value,
                        command: `${skill};`,
                        systemMessage: true,
                        style: {
                            marginTop: "10px"
                        }
                    });
                }

                return commandLines.value.push({
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    command: `${skill};`,
                    systemMessage: true,
                });
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Essas são as ferramentas que gostaria de destacar que tenho maestria e que tenho capacidade de atuar em cenários reais desenvolvendo soluções.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });
            
            return;
        }

        if (commandOptions[0] === "soft-skills.txt" && terminalPath.value  === "~/cv/presentation$"){
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Eu sou uma pessoa muito competente e adoro liderar, mesmo que às vezes eu pareça bravo. Mas a verdade é que eu me dou muito bem com a comunicação e trabalhando em equipe. Acredito que minhas principais qualidades sociais são liderança, confiança e empatia.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Eu gosto de liderar pelo exemplo e inspirar os outros com minha paixão e comprometimento. Assumir responsabilidades não me intimida e eu sempre estou disposto a liderar um grupo.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Eu sou muito confiante em mim mesmo, o que me ajuda a tomar decisões assertivas e enfrentar situações desafiadoras de cabeça erguida. Eu sei que posso superar obstáculos com criatividade e determinação.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'E por fim, a empatia é uma das minhas maiores qualidades. Eu gosto de me colocar no lugar dos outros e entender suas necessidades e sentimentos. Essa habilidade me ajuda a construir relacionamentos saudáveis e duradouros, tanto no âmbito pessoal quanto profissional.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'No geral, essas qualidades me ajudam a ter sucesso em tudo o que faço e me permitem enfrentar qualquer desafio que apareça.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });
            return;
        }

        if (commandOptions[0] === "experiences.txt" && terminalPath.value  === "~/cv/presentation$"){
            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Neste arquivo, compartilho um pouco sobre minha trajetória como desenvolvedor de software, abordando minhas experiências como autônomo e também em empresas. A seguir, destaco três projetos em que atuei como autônomo, além das tecnologias utilizadas em cada um deles:',
                systemMessage: true
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Takeaway: Sistema de cardápio digital e atendimento para comércios. Algumas das tecnologias utilizadas foram: NodeJS, VueJS, TypeScript, Firebase, AWS, Redis, MongoDB, Socket e Stripe.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'GetFitty: Plataforma para saúde física, consistindo em um aplicativo móvel para auxiliar em treinos e alimentação, com a ajuda de personal trainers, nutricionistas e inteligência artificial. Algumas das tecnologias utilizadas na construção desse aplicativo foram: NodeJS, React Native, MongoDB, TensorFlow, Stripe e Socket.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Traderbot: Plataforma para análise, previsões e sugestões de compra em tempo real de criptomoedas, por meio de coleta de dados de exchanges. As tecnologias utilizadas foram: NuxtJS, NodeJS, TypeScript, PostgreSQL, Socket, GraphQL e TensorFlow.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Ótimo, acabei de destacar três projetos em que trabalhei como autônomo e gostaria de compartilhá-los com você. Agora, vamos dar uma olhada nas empresas em que trabalhei como desenvolvedor:',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'MPlan Sistemas e Consultoria: Empresa focada em sistemas e consultoria para hospitais, com foco em planos de saúde. As tecnologias utilizadas foram PHP, VueJS, NodeJS, AWS e PostgreSQL.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'e-Kaizen Digital: Empresa destinada a sistemas ERP. As tecnologias utilizadas foram NodeJS, Redis, Typescript, MariaDB, AWS e Angular.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Chat2Desk Brasil: Empresa que consiste em um CMS multinacional. As tecnologias utilizadas foram PostgreSQL, NodeJS, MongoDB, Firebase, AWS, VueJS, ReactJS, Typescript e RabbitMQ.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Flatmatch: Empresa que consiste em um aplicativo de aluguel de imóveis em conjunto. As tecnologias utilizadas foram React Native, React, MongoDB, AWS, Stripe, Typescript, Nest e Redis.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'CodeExp: Empresa focada em sistemas sob medida para clientes de todos os setores. Algumas das tecnologias utilizadas foram NodeJS, VueJS, NuxtJS, Typescript, Nest, React Native, MongoDB e Stripe.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Espero que esse material possa ajudá-lo a entender melhor meu perfil profissional e minhas habilidades como desenvolvedor.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });
            return;
        }

        return commandLines.value.push({
            command: `Arquivo '${commandOptions[0]}' não encontrado.`,
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: true
        });
    }

    function helpProgram(){
        commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: '"exit" ou "SHIFT + F4": Comando usado para fechar o terminal.',
            systemMessage: true
        });

        commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: '"ls": O comando "ls" é usado para listar os arquivos e pastas presentes no diretório atual. Para usá-lo, basta digitar "ls" na linha de comando e pressionar "Enter". Isso irá exibir uma lista de todos os arquivos e pastas na pasta atual.',
            systemMessage: true,
            style: {
                marginTop: "10px"
            }
        });

        commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: '"cd": O comando "cd" é usado para acessar pastas no terminal. Por exemplo, se você quiser entrar na pasta "Documentos", basta digitar "cd Documentos" e pressionar Enter. Para voltar para a pasta anterior, você pode usar o comando "cd ..". Por exemplo, se você estiver na pasta "Documentos" e quiser voltar para a pasta anterior, basta digitar "cd .." e pressionar Enter. Se você quiser voltar para a pasta raiz (a pasta principal do sistema), basta digitar "cd" e pressionar Enter. Lembre-se de digitar o nome da pasta corretamente e sempre checar o caminho atual com o comando "pwd" antes de utilizar o comando "cd".',
            systemMessage: true,
            style: {
                marginTop: "10px"
            }
        });

        commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: '"python": Comando utilizado para executar programas com extensão (final) ".py", os quais são destacados em verde. Para usar, basta digitar "python" seguido do nome do arquivo que deseja executar na mesma linha. Por exemplo: "python social_network.py". Caso você tenha dúvidas sobre como executar os programas, basta passar a flag "--help" que irá retornar um guia. Exemplo: "python file_analysis.py --help".',
            systemMessage: true,
            style: {
                marginTop: "10px"
            }
        });

        commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: '"./": Comando utilizado para executar programas (destacados em verde) com extensão (final) ".sh". Para usar, basta digitar "./" e em seguida passar junto e na mesma linha o nome do arquivo que deseja executar. Por exemplo: "./file-recognition.sh".',
            systemMessage: true,
            style: {
                marginTop: "10px"
            }
        });

        commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: '"pwd": Esse comando é usado para mostrar o diretório (pasta) atual em que você está. Basta digitar "pwd" (sem aspas) na linha de comando e pressionar enter para que o caminho completo do diretório atual seja exibido na tela. Esse comando é útil para quando você precisa saber em que diretório está trabalhando..',
            systemMessage: true,
            style: {
                marginTop: "10px"
            }
        });

        commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: '"SHIFT + F11": Comando utilizado para maximizar (deixar em tela cheia) a janela atual do terminal.',
            systemMessage: true,
            style: {
                marginTop: "10px"
            }
        });

        commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: '"SHIFT + L": Comando utilizado para limpar os comandos do terminal.',
            systemMessage: true,
            style: {
                marginTop: "10px"
            }
        });
    }

    function listCurrentDirectory(){
        if (terminalPath.value === "~/cv$"){
            commandLines.value.push({
                command: "",
                systemMessage: true,
                user: terminalUser.value,
                directory: terminalPath.value,
                childrens: mainDirectory.value
            });
        }

        if (terminalPath.value === "~/cv/presentation$"){
            commandLines.value.push({
                command: "",
                systemMessage: true,
                user: terminalUser.value,
                directory: terminalPath.value,
                childrens: presentationDirectory.value
            });
        }

        if (terminalPath.value === "~/cv/scripts$"){
            commandLines.value.push({
                command: "",
                systemMessage: true,
                user: terminalUser.value,
                directory: terminalPath.value,
                childrens: scriptsDirectory.value
            });
        }
    }

    function processPythonSocialNetworkScript(commandLine: string, commandOptions: string[]){
        if (commandOptions[1] === "--type" && commandOptions[2] === "linkedin"){
            if (commandOptions[3] === "--open"){
                window.open("https://www.linkedin.com/in/gjeronimo3875br/");
                return commandLines.value.push({
                    command: `https://www.linkedin.com/in/gjeronimo3875br/`,
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    systemMessage: true
                });
            }

            return commandLines.value.push({
                command: `https://www.linkedin.com/in/gjeronimo3875br/`,
                user: terminalUser.value,
                directory: terminalPath.value,
                systemMessage: true
            });
        }

        if (commandOptions[1] === "--type" && commandOptions[2] === "whatsapp"){
            if (commandOptions[3] === "--open"){
                window.open("https://wa.me/5519994215163");
                return commandLines.value.push({
                    command: `https://wa.me/5519994215163`,
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    systemMessage: true
                });
            }

            return commandLines.value.push({
                command: `+55 (19) 99421-5163`,
                user: terminalUser.value,
                directory: terminalPath.value,
                systemMessage: true
            });
        }

        if (commandOptions[1] === "--type" && commandOptions[2] === "github"){
            if (commandOptions[3] === "--open"){
                window.open("https://github.com/jeronimo3875br");
                return commandLines.value.push({
                    command: `https://github.com/jeronimo3875br`,
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    systemMessage: true
                });
            }

            return commandLines.value.push({
                command: `https://github.com/jeronimo3875br`,
                user: terminalUser.value,
                directory: terminalPath.value,
                systemMessage: true
            });
        }

        if (commandOptions[1] === "--type" && commandOptions[2] === "email"){
            if (commandOptions[3] === "--open"){
                window.open("https://mailto:dev.gjeronimo@gmail.com");
                return commandLines.value.push({
                    command: `dev.gjeronimo@gmail.com`,
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    systemMessage: true
                });
            }

            return commandLines.value.push({
                command: `dev.gjeronimo@gmail.com`,
                user: terminalUser.value,
                directory: terminalPath.value,
                systemMessage: true
            });
        }

        if (commandOptions[1] === "--type" && !['success', 'warning', 'danger'].includes(commandOptions[2]))
            return commandLines.value.push({
                command: `${commandOptions[2] ? commandOptions[2] + ":" : ""} Rede social não identificado!`,
                user: terminalUser.value,
                directory: terminalPath.value,
                systemMessage: true
            });

        return commandLines.value.push({
            command: `Use a flag '--help' para obter informações de como usar esse programa.`,
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: true
        });
    }

    function processPythonScripts(commandLine: string, commandOptions: string[]){
        if (commandOptions[1] === "--help"){
            //...
        }

        if (commandOptions[0] === "social_network.py" && terminalPath.value === "~/cv/scripts$")
            return processPythonSocialNetworkScript(commandLine, commandOptions);

        return commandLines.value.push({
            command: `${commandOptions[0] ? commandOptions[0] + ":" : '' } Programa não encontrado!`,
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: true
        });
    }

    function processDirectoryCommand(commandLine: string, commandOptions: string[]){
        if (commandOptions.length === 0 || commandOptions[0] === ".." || commandOptions[0] === "../")
            return terminalPath.value = "~/cv$";

        // id: 0132 => Não faço ideia de como isso está funcionando :)
        
        const pathToPathVerification = commandOptions[0].includes("/");
        
        if (pathToPathVerification){
            const [ beforeBar, afterBar ] = commandOptions[0].split("/");

            if (afterBar === "scripts" && beforeBar === ".." && terminalPath.value !== "~/cv$")
                return terminalPath.value = "~/cv/scripts$";

            if (afterBar === "presentation" && beforeBar === ".." && terminalPath.value !== "~/cv$")
                return terminalPath.value = "~/cv/presentation$";

            return terminalPath.value = "~/cv$";
        }

        // end: id => 0132

        if (terminalPath.value === "~/cv$"){
            const findDirectory = mainDirectory.value.find(({ text, type }) => text === commandOptions[0] && type === "directory");

            if (!findDirectory)
                return commandLines.value.push({
                    command: `${commandOptions[0]}: Diretório não encontrado!`,
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    systemMessage: true
                });

            return terminalPath.value = `~/cv/${findDirectory.text}$`;
        }

        if (terminalPath.value === "~/cv/presentation$"){
            const findDirectory = presentationDirectory.value.find(({ text, type }) => text === commandOptions[0] && type === "directory");

            if (!findDirectory)
                return commandLines.value.push({
                    command: `${commandOptions[0]}: Diretório não encontrado!`,
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    systemMessage: true
                });

            return terminalPath.value = `~/cv/${findDirectory.text}$`;
        }

        if (terminalPath.value === "~/cv/scripts$"){
            const findDirectory = scriptsDirectory.value.find(({ text, type }) => text === commandOptions[0] && type === "directory");

            if (!findDirectory)
                return commandLines.value.push({
                    command: `${commandOptions[0]}: Diretório (pasta) não encontrado!`,
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    systemMessage: true
                });

            return terminalPath.value = `~/cv/${findDirectory.text}$`;
        }
    }

    function terminalScrollToEnd(){
        if (terminalContent.value){
            terminalContent.value.addEventListener('DOMNodeInserted', () => {
                if (terminalContent.value){
                    terminalContent.value.scrollTop = terminalContent.value.scrollHeight;
                }
            });
        }
    }

    function showCurrentDirectoryPath(){
        return commandLines.value.push({
            command: `Diretório (pasta) atual: ${terminalPath.value.replace("~", "").replace("$", "")}`,
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: true
        });
    }

    function fileRecognitionProgram(commandLine: string, commandOptions: string[]){
        if (commandOptions.length === 0)
            return commandLines.value.push({
                command: `A flag "--file" deve ser passada. Caso tenha dúvidas sobre como utilizar esse programa, tente passar a flag "--help". Exemplo: "./file-recognition --help"`,
                user: terminalUser.value,
                directory: terminalPath.value,
                systemMessage: true
            });

        if (commandOptions[0] === "--help"){
            commandLines.value.push({
                command: 'O programa "file-recognition.sh" é um programa para reconhecimento de arquivos. Para usar, basta executar "./file-recognition --type" e em seguida na mesma linha passar o nome do arquivo que você deseja identificar. Por exemplo, se você deseja identificar o arquivo "skills.txt", basta executar (sem aspas) "./file-recognition --type skills.txt".',
                user: terminalUser.value,
                directory: terminalPath.value,
                systemMessage: true
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'O programa dará 4 possíveis respostas:',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '1 - Arquivo não encontrado!',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '2 - Arquivo de leitura.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '3 - Pasta acessível.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: '4 - Programa executável.',
                systemMessage: true,
            });

            commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Lembre-se de se certificar que está no mesmo diretório (pasta) em que o arquivo que deseja identificar se encontra.',
                systemMessage: true,
                style: {
                    marginTop: "10px"
                }
            });
            return;
        }

        if (commandOptions[0] === "--type"){
            if (commandOptions[1] === "welcome.txt" && terminalPath.value === "~/cv$")
                return commandLines.value.push({
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    command: 'Arquivo de leitura.',
                    systemMessage: true
                });

            if (commandOptions[1] === "README.txt")
                return commandLines.value.push({
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    command: 'Arquivo de leitura.',
                    systemMessage: true
                });

            if (commandOptions[1] === "file-recognition.sh")
                return commandLines.value.push({
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    command: 'Programa executável.',
                    systemMessage: true
                });

            if (commandOptions[1] === "thais.sh" && terminalPath.value === "~/cv$")
                return commandLines.value.push({
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    command: 'Programa executável.',
                    systemMessage: true
                });

            if (commandOptions[1] === "presentation" || commandOptions[1] === "scripts" && terminalPath.value === "~/cv$")
                return commandLines.value.push({
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    command: 'Pasta acessível.',
                    systemMessage: true
                });

            if (commandOptions[1] === "skills.txt" && terminalPath.value === "~/cv/presentation$")
                return commandLines.value.push({
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    command: 'Arquivo de leitura.',
                    systemMessage: true
                });

            if (commandOptions[1] === "social_network.py" && terminalPath.value === "~/cv/scripts$")
                return commandLines.value.push({
                    user: terminalUser.value,
                    directory: terminalPath.value,
                    command: 'Programa executável.',
                    systemMessage: true
                });

            return commandLines.value.push({
                user: terminalUser.value,
                directory: terminalPath.value,
                command: 'Arquivo não encontrado!',
                systemMessage: true
            });
        }

        return commandLines.value.push({
            user: terminalUser.value,
            directory: terminalPath.value,
            command: `A flag "${commandOptions[0]}" não é válida!`,
            systemMessage: true
        });
    }

    function processCommandLine(command: string){
        commandLines.value.push({
            command: currentComandLine.value,
            user: terminalUser.value,
            directory: terminalPath.value,
            systemMessage: false
        });

        // terminalScrollToEnd();
        
        if (command){
            const [ commandLine, ...commandOptions ] = command.split(" ");

            if (commandLine === "./thais.sh" && terminalPath.value === "~/cv$")
                return thaisProgram(commandLine, commandOptions);
            
            if (commandLine === "cat")
                return readFilesProgram(commandLine, commandOptions);
            
            if (commandLine === "help")
                return helpProgram();

            if (commandLine === "exit")
                return closeTerminalApp();

            if (commandLine === "ls")
                return listCurrentDirectory();

            if (commandLine === "python")
                return processPythonScripts(commandLine, commandOptions);

            if (commandLine === "cd")
                return processDirectoryCommand(commandLine, commandOptions);

            if (commandLine === "pwd")
                return showCurrentDirectoryPath();

            if (commandLine === "./file-recognition.sh")
                return fileRecognitionProgram(commandLine, commandOptions);

            commandLines.value.push({
                command: `${command}: Comando não identificado!`,
                user: terminalUser.value,
                directory: terminalPath.value,
                systemMessage: true
            });
        }
    }

    function focusWriteLine(){
        if (linesElement.value){
            const lineElement = (linesElement.value.querySelector("li:last-child input") as HTMLElement);
            lineElement.focus();
        }
    }

    watch(props, () => {
        if (terminalElement.value){
            const { terminalHeight, terminalWidth } = getTerminalSize();

            terminalElement.value.style.top = `${props.positionY}px`;
            terminalElement.value.style.left = `${props.positionX}px`;
        }
    });

    watch(commandLines.value, () => {
        const toBackup: ICommandLine[] = [];

        commandLines.value.forEach(command => {
            if (!command.systemMessage){
                toBackup.push(command);
            }
        });

        backupCommandLines.value = toBackup;
    });

    const terminalAppState = computed(() => store.state);

    onMounted(() => {
        identifyKeyboardCommand();
        terminalScrollToEnd();
    });
</script>

<style scoped> 
    .terminal-app {
        position: absolute;
        width: 50%;
        height: 400px;
        border-radius: 7px;
        min-width: 20% !important;
        box-shadow: 0px 0px 10px rgb(0 0 0 / 3%);
        cursor: pointer;
        background: #1d1d1db3;
        backdrop-filter: blur(10px);
        transition: .1s;
        animation: initialTerminalAppAnimation .1s;

        z-index: 1;
    }

    .terminal-app header {
        width: 100%;
        height: 40px;
        background: #41403c;
        cursor: move;
        display: flex;
        align-items: center;
        padding-left: 10px;
        gap: 5px;
    }

    @keyframes initialTerminalAppAnimation {
        from {
            opacity: 0;
            transform: translateX(-400px);
        }

        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes endTerminalAppAnimation {
        from {
            opacity: 1;
            transform: translateX(o);
        }

        to {
            opacity: 0;
            transform: translateX(-400px);
        }
    }

    .window-operation-button {
        background-color: #83817b;
        width: 23px;
        height: 22px;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        padding-top: calc(23px / 7);
        flex-shrink: 0;
    }

    .window-operation-button:nth-child(1){
        background-color: crimson;
    }

    .terminal-app-maximized {
        width: 100vw;
        height: 100vh;
        border-radius: 0px;
        top: 0px !important;
        left: 0px !important;
        z-index: 999;
    }

    .terminal-title {
        color: #cccccc;
        font-size: 16px;
        font-weight: lighter;
        margin-left: 20px;
    }

    .temrinal-app-minimize {
        animation: endTerminalAppAnimation .1s linear;
    }

    .terminal-app-resize {
        cursor: e-resize !important;
        background: red !important;
    }

    .terminal-app main {
        width: 100%;
        height: calc(100% - 40px);
        padding: 7px;
        overflow-y: scroll;
    }

    .terminal-app main::-webkit-scrollbar {
        width: 5px;
        background: transparent;
    }

    .terminal-app main::-webkit-scrollbar-thumb {
        background: rgba(131, 129, 123, .1);
        border-radius: 50px;
    }

    .line {
        display: flex;
        gap: 5px;
        flex-shrink: 0;
    }

    .line p {
        font-size: 14px;
        font-weight: bold;
    }

    .line .user-name {
        color: greenyellow;
        font-family: monospace;
    }

    .line .current-path {
        color: blue;
        font-family: monospace;
    }

    .line input {
        font-size: 14px;
        font-weight: bold;
        color: #cccccc;
        background: transparent;
        font-family: monospace;
        width: calc(100% - 160px);
    }

    .line input:focus {
            width: calc(100% - 180px);
    }

    .system-command-response {
        width: 100%;
        padding-top: 1px;
        padding-bottom: 1px;
    }

    .system-command-response p {
        font-size: 14px;
        font-weight: 200;
        color: #cccccc;
        width: 100%;
    }

    .system-command-response p.ilove-you {
        color: crimson;
        font-weight: bold;
        font-size: 20px;
    }

    .system-command-response p span {
        margin-right: 5px;
    }

    .default-comand-line-message {
        margin-bottom: 10px;
    }

    .script-text {
        color: greenyellow !important;
    }

    .script {
        color: greenyellow !important;
        font-weight: bold;
    }

    .directory {
        color: blue;
        font-weight: bold;
    }

    @media (max-width: 750px){
        .terminal-app {
            width: 100%;
            height: 100%;
            z-index: 3;
            top: 0;
        }

        .window-operation-button.maximize-button {
            display: none;
        }
    }
</style>