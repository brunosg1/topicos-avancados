package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.PropriedadeDTO;
import br.edu.utfpr.api.model.Propriedade;
import br.edu.utfpr.api.repository.PropriedadeRepository;

import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/propriedades", produces = "application/json")
public class PropriedadeController {

    @Autowired
    private PropriedadeRepository propriedadeRepository;

    // GET (busca)
    @GetMapping({"", "/"})
    public ResponseEntity<List<Propriedade>> get(@RequestParam(required = false) String nome) {
        var propriedades = propriedadeRepository.findAll();

        if (nome == null || nome.isEmpty()) {
            return ResponseEntity.ok(propriedades);
        } else {
            List<Propriedade> auxList = new ArrayList<>();
            for (Propriedade propriedade : propriedades) {
                if (propriedade.getNome().equalsIgnoreCase(nome)) {
                    auxList.add(propriedade);
                }
            }
            if (auxList.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Propriedade não encontrada");
            }
            return ResponseEntity.ok(auxList);
        }
    }

    // PUT (atualização)
    @PutMapping({"", "/"})
    public ResponseEntity<Propriedade> put(@RequestBody Propriedade propriedade) {
        Optional<Propriedade> propriedadeExistente = propriedadeRepository.findById(propriedade.getId());

        if (propriedadeExistente.isPresent()) {
            Propriedade atualizada = propriedadeExistente.get();
            atualizada.setNome(propriedade.getNome());
            atualizada.setTamanhoHa(propriedade.getTamanhoHa());
            atualizada.setResponsavel(propriedade.getResponsavel());
            atualizada.setUpdateDate(LocalDateTime.now());

            Propriedade salva = propriedadeRepository.save(atualizada);
            return ResponseEntity.ok(salva);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Propriedade não encontrada");
        }
    }

    // POST (criação)
    @PostMapping({"", "/"})
    public ResponseEntity<Propriedade> post(@RequestBody PropriedadeDTO p){
        var propriedade = new Propriedade();
        propriedade.setNome(p.nome);
        propriedade.setTamanhoHa(p.tamanhoHa);
        propriedade.setResponsavel(p.responsavel);
        propriedade.setCreationDate(LocalDateTime.now());

        Propriedade salva = propriedadeRepository.save(propriedade);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    // DELETE
    @DeleteMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> delete(@RequestParam long id) {
        Optional<Propriedade> propriedade = propriedadeRepository.findById(id);

        if (propriedade.isPresent()) {
            propriedadeRepository.delete(propriedade.get());

            Map<String, Object> resposta = new HashMap<>();
            resposta.put("status", 200);
            resposta.put("mensagem", "Propriedade deletada com sucesso");

            return ResponseEntity.ok(resposta);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Propriedade não encontrada");
        }
    }
}
