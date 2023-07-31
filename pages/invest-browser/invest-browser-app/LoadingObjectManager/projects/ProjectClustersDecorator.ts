"use strict"

import { SelectableClustersDecorator } from "../clusterer/SelectableClustersDecorator.js"
import { ProjectClustersCollection, ProjectsClusterJson } from "./LoadingProjectsManager.js"

export class ProjectClustersDecorator extends SelectableClustersDecorator<ProjectsClusterJson> {
    constructor(collection: ProjectClustersCollection) {
        super(collection)

        collection.events.add('add', (event: ymaps.IEvent<MouseEvent>) => {
            const targetObject = event.get("child")

            globalThis.app.querySelectorPromise('[data-component="clusters-list"]').then((listElement: HTMLUListElement) => {
                const itemInput = document.createElement('input')
                itemInput.type = "checkbox"

                const projectInfo = document.createElement('span')
                projectInfo.innerText = `cluster id: ${targetObject.id}`

                const itemLabel = document.createElement('label')
                itemLabel.style.display = "block"
                itemLabel.style.backgroundColor = "#31708f"

                itemLabel.appendChild(itemInput)
                itemLabel.appendChild(projectInfo)

                const listItem = document.createElement('li')
                listItem.style.marginBlock = ".25em"
                listItem.appendChild(itemLabel)

                listElement.appendChild(listItem)


                itemInput.addEventListener("change", (event) => {
                    itemInput.checked ? this.selectObject(targetObject) : this.resetUnselectedObjectOptionsAsset(targetObject)
                })
            })
        })
    }
}