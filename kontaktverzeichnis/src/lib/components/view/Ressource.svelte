<script lang="ts">
  import { Tile, TextInput, ToastNotification, Button, Tag } from "carbon-components-svelte"
  import TextField from "$lib/components/TextField.svelte"
  import AcceptIcon from "$lib/icons/AcceptIcon.svelte"
  import DeleteIcon from "$lib/icons/DeleteIcon.svelte"
  import AddIcon from "$lib/icons/AddIcon.svelte"
  import { enhance } from "$app/forms"
  import NumberTable from "./NumberTable.svelte"
  import AddNumber from "./AddNumber.svelte"
  import AddDepartment from "./AddDepartment.svelte"
  import AddCompany from "./AddCompany.svelte"

  let popups: any = {
    AddNumber: AddNumber,
    AddDepartment: AddDepartment,
    AddCompany: AddCompany,
  }
  let popup: string = ""

  export let data: any
  export let form: any
  export let edit: boolean

  let Combofield: any
  if (edit) {
    Combofield = TextInput
  } else {
    Combofield = TextField
  }

  let telefonEintraege: any = []

  function getTelefonEintraege() {
    let telefonEintraege: any = []
    if (data.ressource.expand.telefonEintraege) {
      for (let eintrag of data?.ressource?.expand?.telefonEintraege) {
        let standort = eintrag?.expand?.standort?.bezeichnung
        if (telefonEintraege[standort]) {
          telefonEintraege[standort].push(eintrag)
        } else {
          telefonEintraege[standort] = [eintrag]
        }
      }
      return telefonEintraege
    }
  }

  $: if (data.ressource.expand.telefonEintraege) {
    telefonEintraege = getTelefonEintraege()
  }

  function resetForm() {
    form = null
  }

  let departments: any = []
  $: if (data.ressource.expand.abteilungen) {
    departments = data.ressource.expand.abteilungen
  }

  let companies: any = []
  $: if (data.ressource.expand.standort) {
    companies = data.ressource.expand.standort
  }
</script>

<svelte:head>
  <title>{data.ressource.bezeichner}</title>
</svelte:head>

{#if form?.error}
  <div class="toast">
    <ToastNotification title="Error" subtitle={form.error} timeout={5000} />
  </div>
{:else if form?.success}
  <div class="toast">
    <ToastNotification title="Success" kind="success" timeout={5000} />
  </div>
{/if}

{#if popup}
  <svelte:component this={popups[popup]} bind:popup bind:form />
{/if}
<div class="line">
  <svg xmlns="http://www.w3.org/2000/svg" width="36" viewBox="0 0 32 32"
    ><path
      fill="currentColor"
      d="M16 14h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm-8-12h10v2H16z" /><path
      fill="currentColor"
      d="M28 6H14V5a2.002 2.002 0 0 0-2-2H8a2.002 2.002 0 0 0-2 2v1H4a2.002 2.002 0 0 0-2 2v18a2.002 2.002 0 0 0 2 2h24a2.002 2.002 0 0 0 2-2V8a2.002 2.002 0 0 0-2-2ZM8 5h4v17H8Zm20 21H4V8h2v14a2.002 2.002 0 0 0 2 2h4a2.002 2.002 0 0 0 2-2V8h14Z" /></svg>
  <h2>{data.ressource.bezeichner}</h2>
</div>
<div class="grid">
  <Tile light>
    {#if edit}
      <form class="top-right-button" action="?/save" method="POST" use:enhance>
        <Button
          on:click={resetForm}
          type="submit"
          value={JSON.stringify(data.ressource)}
          name="data"
          icon={AcceptIcon}
          size="small"
          kind="ghost"
          iconDescription="??nderungen speichern" />
      </form>
    {/if}
    <h4 class="category">Pers??nliche Daten</h4>
    <div class="line">
      <Combofield labelText="Name" bind:value={data.ressource.bezeichner} />
    </div>
    <div class="line">
      <Combofield labelText="E-Mail" bind:value={data.ressource.email} />
      <a href="mailto:{data.ressource.email}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="currentColor" class="bi bi-envelope-at mail" viewBox="0 0 16 16">
          <path
            d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
          <path
            d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
        </svg>
      </a>
    </div>
  </Tile>
  <Tile light>
    {#if edit}
      <div
        on:keydown
        on:click={() => {
          popup = "AddNumber"
        }}
        class="top-right-button">
        <Button icon={AddIcon} size="small" kind="ghost" iconDescription="Nummer hinzuf??gen" />
      </div>
    {/if}
    <h4 class="category">Telefon</h4>
    {#each Object.keys(telefonEintraege) as standort}
      <div class="company">
        <p>{standort}:</p>
        <table>
          {#each telefonEintraege[standort] as number}
            <NumberTable {number}>
              {#if edit}
                <form class="del" action="?/delNumber" method="POST" use:enhance>
                  <label on:click={resetForm} on:keydown>
                    <input type="submit" class="hidden" name="data" value={number.id} />
                    <DeleteIcon size={14} />
                  </label>
                </form>
              {/if}
            </NumberTable>
          {/each}
        </table>
      </div>
    {/each}
  </Tile>
  <Tile light>
    {#if edit}
      <div
        on:keydown
        on:click={() => {
          popup = "AddDepartment"
        }}
        class="top-right-button">
        <Button icon={AddIcon} size="small" kind="ghost" iconDescription="Abteilung hinzuf??gen" />
      </div>
    {/if}
    <h4 class="category">Abteilung</h4>
    {#each departments as abteilung (abteilung.id)}
      <div class="departments">
        <Tag>{abteilung.bezeichnung}</Tag>
        {#if edit}
          <form action="?/delDepartment" method="POST" use:enhance>
            <label on:click={resetForm} on:keydown>
              <input type="submit" class="hidden" name="data" value={abteilung.id} />
              <DeleteIcon size={14} />
            </label>
          </form>
        {/if}
      </div>
    {/each}
  </Tile>
  <Tile light>
    {#if edit}
      <div
        on:keydown
        on:click={() => {
          popup = "AddCompany"
        }}
        class="top-right-button">
        <Button icon={AddIcon} size="small" kind="ghost" iconDescription="Standort hinzuf??gen" />
      </div>
    {/if}
    <h4 class="category">Standort</h4>
    {#each companies as standort (standort.id)}
      <div class="departments">
        <Tag>{standort.bezeichnung}</Tag>
        {#if edit}
          <form action="?/delCompany" method="POST" use:enhance>
            <label on:click={resetForm} on:keydown>
              <input type="submit" class="hidden" name="data" value={standort.id} />
              <DeleteIcon size={14} />
            </label>
          </form>
        {/if}
      </div>
    {/each}
  </Tile>
</div>

<style>
  .departments {
    display: flex;
    align-items: center;
  }
  .del {
    margin-left: 1rem;
  }
  .company {
    margin-bottom: 1rem;
  }
  .toast {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 100;
  }
  .hidden {
    display: none;
  }
  .top-right-button {
    position: relative;
    right: calc(-100% + 2rem);
    height: 0px;
    width: 0px;
  }
  .mail {
    position: relative;
    top: 2.2rem;
    color: var(--cds-text-01);
  }
  .line {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .category {
    margin-bottom: 1rem;
  }
  @media all and (min-width: 955px) {
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
    }
  }

  @media all and (max-width: 955px) {
    .grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 1rem;
    }
  }
</style>
