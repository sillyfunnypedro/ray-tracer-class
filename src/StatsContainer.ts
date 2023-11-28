class StatsContainer {
    elapsedTime: number = 0;
    static instance: StatsContainer | null = null;

    private constructor() {
        // do nothing
    }

    static create(): StatsContainer {
        return new StatsContainer();
    }

    static getInstance(): StatsContainer {
        if (StatsContainer.instance === null) {
            StatsContainer.instance = StatsContainer.create();
        }
        return StatsContainer.instance;
    }

}

export default StatsContainer;