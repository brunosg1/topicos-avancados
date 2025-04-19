package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.repository.CulturaRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping(value="/culturas", produces = "application/json")

public class CulturaController {
    @Autowired
    private CulturaRepository culturaRepository;

   @GetMapping({"", "/"})
    public List<Cultura> get(@RequestParam(required = false) String nome) {
        var culturas = culturaRepository.findAll();

        if (nome == null || nome.isEmpty()) {
            // Retorna todas as culturas se nome não for informado, pode retornar uma lista vazia
            return culturas;
        } else {
            List<Cultura> auxList = new ArrayList<>();
            for (Cultura cultura : culturas) {
                if (cultura.getNome().equalsIgnoreCase(nome)) {
                    auxList.add(cultura);
                }
            }
            if (auxList.isEmpty()){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada");          
            }
            return auxList; //retorna lista com respostas
        }
    }
    @PutMapping({"", "/"})
    public Cultura put(@RequestBody Cultura cultura) {
        Optional<Cultura> culturaExistente = culturaRepository.findById(cultura.getId());

        if (culturaExistente.isPresent()) {
            Cultura atualizada = culturaExistente.get();
            atualizada.setNome(cultura.getNome());
            atualizada.setTempoCultivoDias(cultura.getTempoCultivoDias());
            atualizada.setEpocaPlantio(cultura.getEpocaPlantio());

            return culturaRepository.save(atualizada); 
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada");
        }
    }

    @PostMapping({"", "/"})
    public Cultura post(@RequestBody Cultura p){
        return culturaRepository.save(p);
    }

    @DeleteMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> delete(@RequestParam long id) {
        Optional<Cultura> cultura = culturaRepository.findById(id);

        if (cultura.isPresent()) {
            culturaRepository.delete(cultura.get());

            Map<String, Object> resposta = new HashMap<>();
            resposta.put("status", 200);
            resposta.put("mensagem", "Cultura deletada com sucesso");

            return ResponseEntity.ok(resposta);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada");
        }
    }
}
