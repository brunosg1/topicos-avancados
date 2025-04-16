package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.utfpr.api.model.Doenca;
import br.edu.utfpr.api.repository.DoencaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/doencas", produces = "application/json")

public class DoencaController {
    @Autowired
    private DoencaRepository doencaRepository;

    // @GetMapping("/1")
    // public Culturas getOne(){
    //     var p = new Culturas(1, "Pedro", "Henrique", "pedro@utfpr.com.br");

    //     return p;
    // }

    @PostMapping({"", "/"})
    public Doenca create(@RequestBody Doenca p){
        return doencaRepository.save(p);
    }
}
