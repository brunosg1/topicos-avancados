package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.repository.CulturaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/culturas", produces = "application/json")

public class CulturaController {
    @Autowired
    private CulturaRepository culturaRepository;

    // @GetMapping("/1")
    // public Culturas getOne(){
    //     var p = new Culturas(1, "Pedro", "Henrique", "pedro@utfpr.com.br");

    //     return p;
    // }

    @PostMapping({"", "/"})
    public Cultura create(@RequestBody Cultura p){
        return culturaRepository.save(p);
    }
}
