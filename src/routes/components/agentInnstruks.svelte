<script>
    import '$lib/global.css';
    export let systemInstruks = ""; // Eksporter som prop for å kunne bindes
    let selectedConfigAgent = "";
    
    const saveConfig = () => {
        console.log(`Lagrer instruksjoner for ${selectedConfigAgent}: ${systemInstruks}`);
        
    };

</script>
    
    <div class="agent_config" class:open={selectedConfigAgent}>
        
        <select class="config-select" bind:value={selectedConfigAgent} >
            <label for="">Test</label>
            <option value="Openai">OpenAI</option>
            <option value=""></option>
            
        </select>
        
        {#if selectedConfigAgent}
        <input class="config-input" type="text" 
               bind:value={systemInstruks} 
               placeholder="Skriv instruksjoner til {selectedConfigAgent}...">
        <button class="config-save" on:click={saveConfig}>Lagre</button>
    {/if}
      
    </div>

    <style>
        .agent_config {
            position: absolute;
            top: 11px;
            left: 5%;
            width: 280px;
            transition: all 0.3s ease;
        }
        
        .agent_config.open {
            background-color: var(--color-himmel-10);
            border: 1px solid var(--color-stein-50);
            border-radius: 10px;
            padding: 15px;
            width: 350px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .config-select {
            width: 100%;
            padding: 8px 12px;
            background-color: var(--color-gran-30);
            border: 1px solid var(--color-stein-50);
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            transition: border-color 0.2s;
        }
        
        .config-select:focus {
            outline: none;
            border-color: var(--color-himmel-10);
        }
        
        .config-input {
            width: 100%;
            padding: 10px 12px;
            margin: 10px 0 8px 0;
            border: 1px solid var(--color-stein-50);
            border-radius: 5px;
            font-size: 14px;
            background-color: white;
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .config-input:focus {
            outline: none;
            border-color: var(--color-himmel-10);
            box-shadow: 0 0 0 2px rgba(126, 214, 223, 0.2);
        }
        
        .config-save {
            padding: 8px 16px;
            background-color: var(--color-gran-30);
            color: black;
            border: 1px solid var(--color-stein-50);
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s, box-shadow 0.2s;
        }
        
        .config-save:hover {
            background-color: var(--color-gran-50);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
    </style>