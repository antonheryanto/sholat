<script>
    import { onMount } from 'svelte';
    import { labels, timeRefs, hijri, times, getDayIndex, getTime } from "$lib/jadualSholat";
    let date = $state(new Date());
    let ix = $derived(getDayIndex(date) * 8);
    let hijr = $derived(times.slice(ix, ix+2));
    let time = $derived(times.slice(ix+2, ix+2+6));
    let timeIndex = $state(0);

    
    /**
     * @param {number} hour
     * @param {Array<number>} timeRefs
     */
    function getIndex (hour, timeRefs) {
        if (hour <= timeRefs[0] || hour > timeRefs[timeRefs.length - 1])
            return 0
        for (let i = timeRefs.length - 1; i > -1; i--){
            if (hour > timeRefs[i])
                return i + 1;
        }
        return 0;
    }

    
    let timeEl;
    onMount(() => {
		const interval = setInterval(() => date = new Date(), 1000);
        timeIndex = getIndex(8, timeRefs);
        console.log(timeIndex)
        timeEl = document.getElementById(`time-${timeRefs[timeIndex]}`);
        if (timeEl)
            timeEl.scrollIntoView();
		return () => clearInterval(interval);
	});
</script>

<div class="container">
<h1>Jadual Solat</h1>
<div class="header">
    <div class="col-4 col-12-sm">{date.toLocaleDateString('en-MY', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
    <div class="col-4 col-12-sm">{hijr[0]} {hijri[hijr[1]]} {hijr[1] < times[2] ? 1446 : 1447} Hijri</div>
    <div class="col-4 col-12-sm">{date.toLocaleTimeString([], {hour12:false, hour: '2-digit', minute: '2-digit'})}</div>
</div>
<div class="time">
    <div>
        <div>{labels[0]}</div>
        <div>{getTime(timeRefs[0], time[0]-10)}</div>
    </div>
    {#each time as m, i}
    <div id="time-{timeRefs[i]}">
        <div class="{ i == timeIndex ? ' label' : ''}">{labels[i+1]}</div>
        <div class="{ i == timeIndex ? ' active' : ''}">{getTime(timeRefs[i], m)}</div>
    </div>
    {/each}
</div>
</div>

<style>
    :global(html) {
        --color-text: hsl(204, 4%, 75%);
        --color-active: hsl(0, 0%, 100%);
        --color-background: hsl(210deg 15% 6%);
    }
    *, *::before, *::after { box-sizing: border-box; }
    * { margin: 0; }
    :global(body) { 
        line-height: 1.5;
        -webkit-font-smoothing: antialiased; 
        font-family: "Wotfard", "Wotfard-fallback", sans-serif;
        color: var(--color-text);
        background-color: var(--color-background);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        text-align: center;
        height: 100%;
    }
    .active {
        color: var(--color-active);
        font-weight: bold;
    }
    @media (min-width: 80rem) {
        .container { 
            width: 100rem;
        }
        .header {
            display: flex; 
            gap: 4rem;
            justify-content: center;
            place-content: center;
        }
        .time {
            display: flex;
            gap: 5rem;
            justify-content: center;
            margin-top: 0.5rem;
        }
    }
    @media (min-width: 30rem) and (max-width:80rem) {
        .time {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 0.5rem;
        }
    }
    @media (max-width: 30rem) {
        .time { margin-top: 0.8rem;}
        .time div { margin-top: 0.3rem; }
        .active { font-size: 7rem;}
        .label { font-size: 2rem;}
    }
</style>