class ParfaitEvent extends AchivementEvent {
    constructor(id, type, position, size, affect) {
        super(id, type, position, size, affect);
        this.exist = !this.getHistory().includes(id);
        this.name = "parfait";
    }
}
