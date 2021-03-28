class bf {

    constructor() {

        this.program = new Uint8Array(64*1024);
        this.memory  = new Uint8Array(1024*1024);
        this.running = 0;

        this.con = document.querySelector("#console");
        this.inp = document.querySelector("#input");
        this.sta = document.querySelector("#status");

        this.pc   = 0;
        this.mm   = 0;
        this.size = 0;
        this.paused = 0;

        document.querySelector("#start").addEventListener("click", function() {

            let text = document.querySelector("#program").value;
            this.size = 0;

            for (let i = 0; i < text.length; i++) {

                let ch = text.substr(i, 1);
                if (["+","-",">","<",".",",","[","]"].includes(ch))
                    this.program[this.size++] = ch.charCodeAt(0);
            }

            for (let i = 0; i < 1024*1024; i++)
                this.memory[i] = 0;

            document.querySelector("#console").innerHTML = '';

            this.mm = 0;
            this.pc = 0;
            this.paused = 0;
            this.running = 1;

            return false;

        }.bind(this));

        document.querySelector("#stop").addEventListener("click", function() { this.running = 0; }.bind(this));
        document.querySelector("#input").addEventListener("keyup", function() {
             if (this.running && this.paused) {
                 this.con.innerHTML += this.inp.value.substr(0, 1); // Интерактивный ввод
             }
             this.paused = 0;

        }.bind(this));

        this.frame();
    }

    frame() {

        const instr = 25000;
        const codes = "+-><.,[]";

        let brc;

        const brcl = codes.charCodeAt(6),
              brcr = codes.charCodeAt(7);

        this.sta.innerHTML = (this.running ? "RUN" : "") + " " + (this.paused ? "PAUSED" : "");

        if (this.running && !this.paused) {

            for (let k = 0; k < instr; k++) {

                if (this.pc >= this.size) {
                    this.running = 0;
                    break;
                }

                let opcode = this.program[this.pc++];
                switch (opcode) {

                    /* + */ case codes.charCodeAt(0): this.memory[this.mm]++; break;
                    /* - */ case codes.charCodeAt(1): this.memory[this.mm]--; break;
                    /* > */ case codes.charCodeAt(2): this.mm++; break;
                    /* < */ case codes.charCodeAt(3): this.mm--; break;

                    /* . */
                    case codes.charCodeAt(4):
                        this.con.innerHTML += String.fromCharCode(this.memory[this.mm]);
                        break;

                    /* , */
                    case codes.charCodeAt(5):

                        if (this.inp.value.length > 0) {
                            this.memory[this.mm] = this.inp.value.charCodeAt(0);
                            this.inp.value = this.inp.value.substr(1);
                        } else {
                            this.paused = 1;
                            this.pc--;
                        }
                        break;

                    /* [ */
                    case brcl:

                        if (this.memory[this.mm] == 0) {

                            brc = 1;
                            while (brc) {

                                if      (this.program[this.pc] == brcl) brc++;
                                else if (this.program[this.pc] == brcr) brc--;
                                this.pc++;
                            }
                        }

                        break;

                    /* ] */
                    case brcr:

                        brc = 1;
                        if (this.memory[this.mm]) {

                            this.pc--;
                            while (brc) {

                                this.pc--;
                                if      (this.program[this.pc] == brcl) brc--;
                                else if (this.program[this.pc] == brcr) brc++;
                            }
                        }

                        break;
                }
            }
        }

        setTimeout(function(e) { this.frame(); }.bind(this), 25);
    }
}
