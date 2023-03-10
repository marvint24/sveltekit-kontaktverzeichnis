import stringSimilarity from "string-similarity"
import { getDotEnv } from "$lib/scripts/pb.js"
import PocketBase from "pocketbase"

export const actions = {
  search: async ({ request }: any) => {
    const body = Object.fromEntries(await request.formData())

    if (!body.searchTxt) {
      return { nodata: true }
    }

    let filter = body.searchTxt
      .split(" ")
      .map((word: string) => `index ?~ "${word}"`)
      .join(" || ")

    let env: any
    env = getDotEnv()
    const pb = new PocketBase("http://127.0.0.1:8090")
    await pb.collection("users").authWithPassword(env.parsed.APIUser, env.parsed.APIPW)

    let [persons, ressources] = await Promise.all([
      pb.collection("person").getList(1, 40, {
        filter: filter,
        expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort",
      }),
      pb.collection("ressource").getList(1, 40, {
        filter: filter,
        expand: "standort,abteilungen,telefonEintraege,telefonEintraege.eintragTyp,telefonEintraege.standort",
      }),
    ])

    function makeIterable(value: any): any {
      if (typeof value[Symbol.iterator] === "function") {
        return value
      }
      return [value]
    }

    function createCommonData(obj: any) {
      let abteilungen = []
      if (obj.expand.abteilungen) {
        for (let abteilung of makeIterable(obj.expand.abteilungen)) {
          abteilungen.push({ id: abteilung.id, bezeichnung: abteilung.bezeichnung })
        }
      }
      abteilungen.sort((a: any, b: any) => {
        if (a.bezeichnung < b.bezeichnung) {
          return -1
        }
        if (a.bezeichnung > b.bezeichnung) {
          return 1
        }
        return 0
      })

      let telefonEintraege = []
      if (obj.expand.telefonEintraege) {
        for (let telefonEintrag of makeIterable(obj.expand.telefonEintraege)) {
          telefonEintraege.push({
            id: telefonEintrag.id,
            nummer: telefonEintrag.nummer,
            eintragTyp: telefonEintrag.expand.eintragTyp.bezeichner,
            standort: telefonEintrag.expand.standort.bezeichnung,
          })
        }
      }

      let standorte = []
      if (obj.expand.standort) {
        for (let standort of makeIterable(obj.expand.standort)) {
          standorte.push({ id: standort.id, bezeichnung: standort.bezeichnung })
        }
      }
      standorte.sort((a: any, b: any) => {
        if (a.bezeichnung < b.bezeichnung) {
          return -1
        }
        if (a.bezeichnung > b.bezeichnung) {
          return 1
        }
        return 0
      })

      let similarity = stringSimilarity.compareTwoStrings(body.searchTxt, obj.index)

      let data = {
        similarity: similarity,
        id: obj.id,
        abteilungen: abteilungen,
        standort: standorte,
        kontakt: { telefonEintraege: telefonEintraege, email: obj.email },
      }

      return data
    }

    let result = []

    if (persons.items) {
      for (let person of makeIterable(persons.items)) {
        let name = ""
        if (person.titel) {
          name += person.titel + " "
        }

        let data: any = {
          type: "person",
          name: { name: `${name}${person.vorname} ${person.nachname}`, id: person.id, type: "person" },
        }

        result.push(Object.assign(data, createCommonData(person)))
      }
    }

    if (ressources.items) {
      for (let ressource of makeIterable(ressources.items)) {
        let data: any = {
          type: "ressource",
          name: { name: ressource.bezeichner, id: ressource.id, type: "ressource" },
        }

        result.push(Object.assign(data, createCommonData(ressource)))
      }
    }

    result.sort((a: any, b: any) => {
      if (a.similarity > b.similarity) {
        return -1
      }
      if (a.similarity < b.similarity) {
        return 1
      }
      return 0
    })

    if (result.length > 0) {
      // console.log(result)
      return { data: structuredClone(result) }
    }
    return { nodata: true }
  },
}
