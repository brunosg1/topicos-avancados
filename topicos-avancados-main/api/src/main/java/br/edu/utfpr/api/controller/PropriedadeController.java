package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.utfpr.api.model.Propriedade;
import br.edu.utfpr.api.repository.PropriedadeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/propriedades", produces = "application/json")

public class PropriedadeController {
    @Autowired
    private PropriedadeRepository propriedadeRepository;

    // @GetMapping("/1")
    // public Culturas getOne(){
    //     var p = new Culturas(1, "Pedro", "Henrique", "pedro@utfpr.com.br");

    //     return p;
    // }

    @PostMapping({"", "/"})
    public Propriedade create(@RequestBody Propriedade p){
        return propriedadeRepository.save(p);
    }
}
