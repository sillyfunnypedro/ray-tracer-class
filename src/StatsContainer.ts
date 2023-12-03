class StatsContainer {
    private _startTime: number = 0;

    static instance: StatsContainer | null = null;
    private _stopRenderRequested: boolean = false;

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

    stopRenderRequested(): boolean {
        return this._stopRenderRequested;
    }

    requestStopRender(): void {
        this._stopRenderRequested = true;
    }

    clearStopRenderRequest(): void {
        this._stopRenderRequested = false;
    }

    startTimer(): void {
        this._startTime = Date.now();
    }

    getElapsedTime(): number {
        let elapsedTime = Date.now() - this._startTime;
        return elapsedTime;
    }

}

export default StatsContainer;