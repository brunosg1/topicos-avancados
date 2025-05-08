package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.PropriedadeDTO;
import br.edu.utfpr.api.model.Propriedade;
import br.edu.utfpr.api.repository.PropriedadeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@SecurityRequirement(name = "Authorization")
@Tag(name = "Propriedades", description = "Todas as propriedades cadastradas no sistema")
@RequestMapping(value = "/propriedades", produces = "application/json")
public class PropriedadeController {

    @Autowired
    private PropriedadeRepository propriedadeRepository;

    @Operation(summary = "Obtem propriedades", description = "Obtem todas as propriedades cadastradas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Propriedades retornadas com sucesso"),
        @ApiResponse(responseCode = "404", description = "Nenhuma propriedade encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping({ "" })
    public ResponseEntity<List<Propriedade>> getAll(@RequestParam(required = false) Long id) {
        List<Propriedade> propriedades;

        if (id == null) {
            propriedades = propriedadeRepository.findAll();
        } else {
            propriedades = propriedadeRepository.findById(id).stream().toList();
        }

        if (propriedades.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Propriedade não encontrada");
        }

        return ResponseEntity.ok(propriedades);
    }

    @Operation(summary = "Obter por id", description = "Obtem uma propriedade pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Propriedade encontrada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Propriedade não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Propriedade> getById(@PathVariable Long id) {
        Propriedade propriedade = propriedadeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Propriedade não encontrada"));

        return ResponseEntity.ok(propriedade);
    }

    @Operation(summary = "Salvar propriedade", description = "Salva uma propriedade nova no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Propriedade atualizada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Propriedade não encontrada"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PutMapping({ "" })
    public ResponseEntity<Propriedade> put(@RequestBody @Valid Propriedade propriedade) {
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

    @Operation(summary = "Editar propriedade", description = "Edita ou altera uma propriedade no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Propriedade criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping({ "" })
    public ResponseEntity<Propriedade> post(@RequestBody @Valid PropriedadeDTO p) {
        var propriedade = new Propriedade();
        propriedade.setNome(p.nome);
        propriedade.setTamanhoHa(p.tamanhoHa);
        propriedade.setResponsavel(p.responsavel);
        propriedade.setCreationDate(LocalDateTime.now());

        Propriedade salva = propriedadeRepository.save(propriedade);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @Operation(summary = "Deleta propriedade", description = "Deleta uma propriedade no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Propriedade deletada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Propriedade não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @DeleteMapping({ "/{id}" })
    public ResponseEntity<Map<String, Object>> delete(@PathVariable long id) {
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
