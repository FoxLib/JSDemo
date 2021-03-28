class bf {

    constructor() {

        this.program = new Uint8Array(64*1024);
        this.memory  = new Uint8Array(1024*1024);
        this.running = 0;

        this.pc   = 0;
        this.mm   = 0;
        this.size = 0;

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
            this.running = 1;

            return false;

        }.bind(this));

        document.querySelector("#stop").addEventListener("click", function() { this.running = 0; }.bind(this));

        this.frame();
    }

    frame() {

        const instr = 25000;
        const codes = "+-><.,[]";

        let con = document.querySelector("#console");
        let inp = document.querySelector("#input");
        let brc;

        const brcl = codes.charCodeAt(6),
              brcr = codes.charCodeAt(7);

        if (this.running) {

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

                        con.innerHTML += String.fromCharCode(this.memory[this.mm]);
                        break;

                    /* , */
                    case codes.charCodeAt(5):

                        if (inp.value.length > 0) {
                            this.memory[this.mm] = inp.value.charCodeAt(0);
                            inp.value = inp.value.substr(1);
                        } else {
                            this.memory[this.mm] = 0;
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
